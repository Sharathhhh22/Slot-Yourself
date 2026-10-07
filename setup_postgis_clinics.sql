-- Enable PostGIS extension for distance sorting
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add latitude, longitude and a PostGIS geometry column to clinics
ALTER TABLE clinics 
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS location geography(Point, 4326);

-- Update the location column automatically when lat/lng changes
CREATE OR REPLACE FUNCTION update_clinic_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_clinic_location ON clinics;
CREATE TRIGGER trg_update_clinic_location
BEFORE INSERT OR UPDATE OF latitude, longitude ON clinics
FOR EACH ROW
EXECUTE FUNCTION update_clinic_location();

-- Create a helper function to find nearby clinics with doctor availability
-- This function takes user latitude, longitude and radius in meters
CREATE OR REPLACE FUNCTION get_nearby_clinics(
  user_lat DOUBLE PRECISION, 
  user_lon DOUBLE PRECISION, 
  search_radius_meters INT DEFAULT 50000
)
RETURNS TABLE (
  clinic_id UUID,
  clinic_name TEXT,
  clinic_address TEXT,
  distance_meters FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id,
    name,
    address,
    ST_Distance(location, ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography) as distance_meters
  FROM clinics
  WHERE is_active = true 
    AND location IS NOT NULL
    AND ST_DWithin(location, ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography, search_radius_meters)
  ORDER BY distance_meters ASC;
END;
$$ LANGUAGE plpgsql;
