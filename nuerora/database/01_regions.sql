-- 1. Regions: one row for each geographic area you want to track.
CREATE TABLE regions (
    region_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    region_name TEXT NOT NULL,
    country TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL
        CHECK (latitude >= -90 AND latitude <= 90),
    longitude DOUBLE PRECISION NOT NULL
        CHECK (longitude >= -180 AND longitude <= 180)
);

-- Sample regions. PostgreSQL generates region_id automatically.
INSERT INTO regions (region_name, country, latitude, longitude)
VALUES
    ('Sundarbans', 'India', 21.9497, 89.1833),
    ('Serengeti', 'Tanzania', -2.3333, 34.8333),
    ('Amazonas', 'Brazil', -3.4653, -62.2159);
