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

-- USERS TABLE CREATION

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  reset_token TEXT,
  reset_token_expires TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT(now()),
  updated_at TIMESTAMP DEFAULT(now())
)

-- SESSION TABLE CREATION 

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" 
ADD CONSTRAINT "session_pkey" 
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- foreign key
ALTER TABLE "recipes" 
ADD COLUMN user_id INTEGER

ALTER TABLE "recipes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id")