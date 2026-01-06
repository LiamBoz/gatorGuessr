package server

import (
	"context"
	"fmt"
	"math"
	"net/http"
	"path/filepath"

	"backend/internal/exifutil"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

func (s *Server) getImage(c *gin.Context) {
	var img ImageResponse
	err := s.db.QueryRow(context.Background(),
		"SELECT id, filepath, latitude, longitude FROM public.images ORDER BY random() LIMIT 1").
		Scan(&img.ID, &img.Filepath, &img.Lat, &img.Lon)
	if err != nil {
		c.JSON(500, gin.H{"error": "could not fetch image"})
		return
	}
	img.Filepath = "/api/images/" + img.Filepath
	c.IndentedJSON(200, img)
}

func (s *Server) postGuess(c *gin.Context) {
	var guess GuessRequest
	var img ImageResponse
	var score int16

	if err := c.BindJSON(&guess); err != nil {
		return
	}

	err := s.db.QueryRow(context.Background(),
		"SELECT id, filepath, latitude, longitude FROM public.images WHERE id=$1", guess.ImgID).
		Scan(&img.ID, &img.Filepath, &img.Lat, &img.Lon)
	if err != nil {
		c.JSON(500, gin.H{"error": "could not fetch image"})
		return
	}
	// distance calculation, should be split into a separate function eventually
	var dlat float64 = math.Abs(guess.Lat - img.Lat)
	var dlon float64 = math.Abs(guess.Lon - img.Lon)

	var earthRadius float64 = 6371000
	var a float64 = math.Pow(math.Sin(dlat/2), 2) + math.Cos(guess.Lat)*math.Cos(img.Lat)*math.Pow(math.Sin(dlon/2), 2)
	var b float64 = math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	var distance float64 = earthRadius * b
	// score calculation, should also be split into another function
	var maxScore int16 = 5000
	var k float64 = math.Ln2 / 30
	var forgivingDistance float64 = 10

	if distance < forgivingDistance {
		score = maxScore
	} else {
		score = maxScore * int16(math.Pow(math.E, k*(distance-forgivingDistance)))
	}

	resp := GuessResponse{
		ImgID:    img.ID,
		GuessLat: guess.Lat,
		GuessLon: guess.Lon,
		TrueLat:  img.Lat,
		TrueLon:  img.Lon,
		Distance: distance,
		Score:    score,
	}

	c.IndentedJSON(200, resp)
}

func (s *Server) uploadImage(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.String(400, "File upload error: %v", err)
		return
	}
	fileExt := filepath.Ext(file.Filename)
	newName := uuid.New().String() + fileExt

	if err := c.SaveUploadedFile(file, filepath.Join("/app/images", newName)); err != nil {
		c.String(500, "save failed: %v", err)
		return
	}
	lat, lon, gpsErr := exifutil.ExtractGps(filepath.Join("/app/images", newName))

	if gpsErr != nil {
		c.String(500, "GPS extraction failed: %v", gpsErr)
		return
	}

	dbErr := s.addImageToDB(newName, lat, lon)

	if dbErr != nil {
		c.String(500, "Failed to add image to db: %v", dbErr)
		return
	}

	c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
}

func (s *Server) addImageToDB(filePath string, lat float64, lon float64) error {
	img := ImageResponse{
		Filepath: filePath,
		Lat:      lat,
		Lon:      lon,
	}
	_, err := s.db.Exec(context.Background(),
		"INSERT INTO public.images (filepath, latitude, longitude, approved) VALUES (@filepath, @latitude, @longitude, @approved)",
		pgx.NamedArgs{
			"filepath":  img.Filepath,
			"latitude":  img.Lat,
			"longitude": img.Lon,
			"approved":  false,
		})
	return err
}
