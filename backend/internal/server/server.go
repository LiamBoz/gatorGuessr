package server

import (
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type Server struct {
	db *pgx.Conn
}

func New(db *pgx.Conn) *Server {
	return &Server{db: db}
}

func (s *Server) RegisterRoutes(router *gin.Engine, imagesDir string) {
	router.GET("/api/image", s.getImage)
	router.POST("/api/guess", s.postGuess)
	router.POST("/api/upload", s.uploadImage)
	router.Static("/api/images", imagesDir)
}
