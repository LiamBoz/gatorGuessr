package main

import (
	"context"
	"fmt"
	"math"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

type Server struct {
	db *pgx.Conn
}

// a coords struct should be made to handle lat/lon at one object & return them as such in the json
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
	dotenv := goDotEnvVariable("DATABASE_URL")
	conn, err := pgx.Connect(context.Background(), dotenv)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		panic(err)
	}
	defer conn.Close(context.Background())

	server := &Server{db: conn}

	router := gin.Default()
	router.GET("/image", server.getImage)
	router.POST("/guess", server.postGuess)

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
	// score calculation, could also be split into another function
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
