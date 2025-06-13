CREATE TABLE IF NOT EXISTS images (
  id SERIAL PRIMARY KEY,
  title TEXT,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS entries (
  id SERIAL PRIMARY KEY,
  image_id INTEGER REFERENCES images(id),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS guesses (
  id SERIAL PRIMARY KEY,
  entry_id INTEGER NOT NULL,
  guessed_longitude DOUBLE PRECISION NOT NULL,
  guessed_latitude DOUBLE PRECISION NOT NULL,
  distance DOUBLE PRECISION NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO images (title, url)
VALUES
  (
    'Marston',
    'https://example.com/images/marston.jpg'
  );

INSERT INTO entries (image_id, latitude, longitude, description)
VALUES
  (
    1,
    29.648912,      
    -82.345176,    
    'My favorite study spot'
  );
