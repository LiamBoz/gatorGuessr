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
	Filepath string  `json:"url"`
	Lat      float64 `json:"latitude"`
	Lon      float64 `json:"longitude"`
}

/*var image = []ImageResponse{
	{Filepath: "google.com", Lat: 65, Lon: 65},
}*/

type GuessRequest struct {
	Lat float64 `json:"latitude"`
	Lon float64 `json:"longitude"`
}

type GuessResponse struct {
	Score float32 `json:"score"`
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
	router.GET("/image", server.getRandomImage)
	router.POST("/guess", server.postGuess)

	router.Run(":8001")
}

func (s *Server) getRandomImage(c *gin.Context) {
	var img ImageResponse
	err := s.db.QueryRow(context.Background(),
		"SELECT filepath, latitude, longitude FROM public.images ORDER BY random() LIMIT 1").
		Scan(&img.Filepath, &img.Lat, &img.Lon)
	if err != nil {
		c.JSON(500, gin.H{"error": "could not fetch image"})
		return
	}
	c.IndentedJSON(200, img)
}

func (s *Server) postGuess(c *gin.Context) {
	var guess GuessRequest

	if err := c.BindJSON(&guess); err != nil {
		return
	}
}
