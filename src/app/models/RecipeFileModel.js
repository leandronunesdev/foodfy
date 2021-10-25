const db = require('../../config/db');
const fs = require('fs');

module.exports = {
  create(data) {
    const query = `
      INSERT INTO recipe_files (
        recipe_id,
        file_id
      ) VALUES ($1, $2)
      RETURNING id
    `;

    const values = [data.recipe_id, data.file_id];

    return db.query(query, values);
  },
  delete(id) {
    return db.query('DELETE FROM recipe_files WHERE file_id = $1', [id]);
  },
};
