package server

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
