package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type ImageResponse struct {
	URL string  `json:"url"`
	Lat float64 `json:"latitude"`
	Lon float64 `json:"longitude"`
}

var image = []ImageResponse{
	{URL: "google.com", Lat: 65, Lon: 65},
}

type GuessRequest struct {
	Lat float64 `json:"latitude"`
	Lon float64 `json:"longitude"`
}

type GuessResponse struct {
	Score float32 `json:"score"`
}

func main() {
	router := gin.Default()
	router.GET("/image", getRandomImage)
	router.POST("/guess")

	router.Run("localhost:8001")
}

func getRandomImage(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, image)
}

func postGuess(c *gin.Context) {
	var guess GuessRequest

	if err := c.BindJSON(&guess); err != nil {
		return
	}
}
