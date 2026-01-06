package main

import (
	"context"
	"fmt"
	"os"

	"backend/internal/config"
	"backend/internal/server"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"github.com/jackc/pgx/v5"
)

func main() {
	dbURL := config.Env("DATABASE_URL")
	imagesDir := config.Env("IMAGES_DIR")
	fmt.Println("Serving images from:", imagesDir)
	fmt.Print(dbURL)
	conn, err := pgx.Connect(context.Background(), dbURL)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		panic(err)
	}
	defer conn.Close(context.Background())

	api := server.New(conn)

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept"},
	}))
	api.RegisterRoutes(router, imagesDir)

	router.Run(":8001")
}
