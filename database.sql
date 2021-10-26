CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    name TEXT,
    path TEXT NOT NULL
)

CREATE TABLE recipe_files (
    id SERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES recipes(id),
    file_id INTEGER REFERENCES files(id)
)

ALTER TABLE chefs
DROP COLUMN avatar_url

ALTER TABLE chefs
ADD COLUMN file_id INTEGER REFERENCES files(id)

ALTER TABLE recipes
ADD COLUMN updated_at timestamp DEFAULT (now())

-- UPDATE_AT
-- create procedure
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql

-- auto updated_at recipes
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
