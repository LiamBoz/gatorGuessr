package main

import (
	"context"
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

type Server struct {
	db *pgx.Conn
}

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
	GuessLat float64 `json:"latitude"`
	GuessLon float64 `json:"longitude"`
	TrueLat  float64 `json:"latitude"`
	TrueLon  float64 `json:"longitude"`
	Distance float64 `json:"distance"`
	Score    float64 `json:"score"`
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
	var score float32

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

	var dlat float64 = guess.Lat - img.Lat
	var dlon float64 = guess.Lon - img.Lon

	c.IndentedJSON(200, score)
}
