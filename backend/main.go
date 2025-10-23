package main

import (
	"context"
	"fmt"
	"math"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	exif "github.com/dsoprea/go-exif/v3"
	exifcommon "github.com/dsoprea/go-exif/v3/common"
	heicexif "github.com/dsoprea/go-heic-exif-extractor"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

type Server struct {
	db *pgx.Conn
}

// ImageResponse coords struct should be made to handle lat/lon at one object & return them as such in the json
type ImageResponse struct {
	ID       int     `json:"id"`
	Filepath string  `json:"filepath"`
	Lat      float64 `json:"latitude"`
	Lon      float64 `json:"longitude"`
}

type GuessRequest struct {
	ImgID int     `json:"img_id"`
	Lat   float64 `json:"latitude"`
	Lon   float64 `json:"longitude"`
}

type GuessResponse struct {
	ImgID    int     `json:"img_id"`
	GuessLat float64 `json:"guess_latitude"`
	GuessLon float64 `json:"guess_longitude"`
	TrueLat  float64 `json:"true_latitude"`
	TrueLon  float64 `json:"true_longitude"`
	Distance float64 `json:"distance"`
	Score    int16   `json:"score"`
}

func goDotEnvVariable(key string) string {
	// load .env file
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading .env file", err)
	}

	return os.Getenv(key)
}

func main() {
	dbURL := goDotEnvVariable("DATABASE_URL")
	imagesDir := goDotEnvVariable("IMAGES_DIR")
	fmt.Println("Serving images from:", imagesDir)
	fmt.Print(dbURL)
	conn, err := pgx.Connect(context.Background(), dbURL)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		panic(err)
	}
	defer conn.Close(context.Background())

	server := &Server{db: conn}

	router := gin.Default()
	router.GET("/api/image", server.getImage)
	router.POST("/api/guess", server.postGuess)
	router.POST("/api/upload", server.uploadImage)
	router.Static("/api/images", imagesDir)

	router.Run(":8001")
}

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
	c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
}

func ExtractGps(path string) (float64, float64, error) {
	ext := strings.ToLower(filepath.Ext(path))

	var exifBytes []byte
	var err error

	if ext == ".heic" || ext == ".heif" {
		parser := heicexif.NewHeicExifMediaParser()
		mc, err := parser.ParseFile(path)
		if err != nil {
			return 0, 0, fmt.Errorf("heic parse error: %v", err)
		}

		_, exifBytes, err = mc.Exif()
		if err != nil {
			return 0, 0, fmt.Errorf("heic exif error: %v", err)
		}
	} else {
		exifBytes, err = exif.SearchFileAndExtractExif(path)
		if err != nil {
			return 0, 0, fmt.Errorf("jpeg exif error: %v", err)
		}
	}

	im, err := exifcommon.NewIfdMappingWithStandard()
	if err != nil {
		return 0, 0, err
	}

	ti := exif.NewTagIndex()

	_, index, err := exif.Collect(im, ti, exifBytes)
	if err != nil {
		return 0, 0, err
	}

	gpsIfd, err := index.RootIfd.ChildWithIfdPath(exifcommon.IfdGpsInfoStandardIfdIdentity)
	if err != nil {
		return 0, 0, fmt.Errorf("no GPS IFD found: %v", err)
	}

	gi, err := gpsIfd.GpsInfo()
	if err != nil {
		return 0, 0, err
	}

	return gi.Latitude.Decimal(), gi.Longitude.Decimal(), nil
}
