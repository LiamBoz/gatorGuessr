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
	distance := haversineMeters(guess.Lat, guess.Lon, img.Lat, img.Lon)
	// score calculation, should also be split into another function
	const maxScore = 5000.0
	const forgivingDistance = 80.0
	const mileMeters = 1609.344
	const targetScoreAtMile = 300.0
	kNear := math.Log(maxScore/targetScoreAtMile) / mileMeters
	kFar := kNear * 2.5

	if distance <= forgivingDistance {
		score = int16(maxScore)
	} else {
		decayed := maxScore * math.Exp(-kNear*(distance-forgivingDistance))
		if distance > mileMeters {
			decayed *= math.Exp(-kFar * (distance - mileMeters))
		}
		if decayed < 0 {
			decayed = 0
		}
		if decayed > maxScore {
			decayed = maxScore
		}
		score = int16(math.Round(decayed))
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
