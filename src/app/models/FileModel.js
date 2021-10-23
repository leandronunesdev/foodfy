const db = require('../../config/db');
const fs = require('fs');

module.exports = {
  create({ filename, path, recipe_id }) {
    const query = `
          INSERT INTO files_test (
            name,
            path,
            recipe_id                       
          ) VALUES ($1, $2, $3)
          RETURNING id
        `;

    const values = [filename, path, recipe_id];

    return db.query(query, values);
  },
};
