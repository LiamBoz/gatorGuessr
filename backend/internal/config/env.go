package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

func Env(key string) string {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading .env file: %v\n", err)
	}

	return os.Getenv(key)
}
