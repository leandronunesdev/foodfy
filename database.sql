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