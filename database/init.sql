CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  filepath TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  approved BOOLEAN,
  title TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE guesses (
  id SERIAL PRIMARY KEY,
  image_id INTEGER REFERENCES images(id),
  guessed_latitude DOUBLE PRECISION NOT NULL,
  guessed_longitude DOUBLE PRECISION NOT NULL,
  distance DOUBLE PRECISION NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO images (filepath, latitude, longitude, title)
VALUES
  (
    'marston.jpg',
    29.648912,      
    -82.345176,    
    'Marston'
  );

