const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
  all() {
    return db.query(
      `SELECT recipes.*,  chefs.name AS chef_name
      FROM recipes 
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      ORDER BY created_at DESC      
      `
    );
  },
  create(data) {
    const query = `
      INSERT INTO recipes (
        title,
        ingredients,
        preparation,
        information,
        chef_id,
        user_id        
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    const values = [
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.chef,
      data.user_id,
    ];

    return db.query(query, values);
  },
  find(id) {
    return db.query(
      `
      SELECT recipes.*,  chefs.name AS chef_name
      FROM recipes 
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1`,
      [id]
    );
  },
  findBy(filter, callback) {
    db.query(
      `
      SELECT recipes.*,  chefs.name AS chef_name
      FROM recipes 
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.title ILIKE '%${filter}%'    
      ORDER BY updated_at DESC  
      `,
      function (err, results) {
        if (err) throw `Database error! ${err}`;

        callback(results.rows);
      }
    );
  },
  update(data) {
    const query = `
        UPDATE recipes SET
            chef_id=($1),
            title=($2),
            ingredients=($3),
            preparation=($4),
            information=($5)
        WHERE id = $6
        `;

    const values = [
      data.chef,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.id,
    ];

    return db.query(query, values);
  },
  delete(id) {
    return db.query(`DELETE FROM recipes WHERE id = $1`, [id]);
  },
  paginate(params) {
    const { limit, offset, callback } = params;

    let query = `
    SELECT recipes.*, (SELECT count(*) FROM recipes) AS total, chefs.name AS chef_name   
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    GROUP BY recipes.id, chefs.id LIMIT $1 OFFSET $2   
    `;

    db.query(query, [limit, offset], function (err, results) {
      if (err) throw `Database Error! ${err}`;

      callback(results.rows);
    });
  },
  files(id) {
    return db.query(
      `
      SELECT recipe_files.*,
      files.name AS name, files.path AS path, files.id AS file_id
      FROM recipe_files
      LEFT JOIN files ON (recipe_files.file_id = files.id)
      WHERE recipe_files.recipe_id = $1
    `,
      [id]
    );
  },
};
