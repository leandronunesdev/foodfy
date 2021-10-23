const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
  all(callback) {
    db.query(
      `SELECT recipes.*,  chefs.name AS chef_name
    FROM recipes 
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)`,
      function (err, results) {
        if (err) throw `Database Error! ${err}`;

        callback(results.rows);
      }
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
        created_at        
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    const values = [
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.chef,
      date(Date.now()).iso,
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
      `,
      function (err, results) {
        if (err) throw `Database error! ${err}`;

        callback(results.rows);
      }
    );
  },
  update(data, callback) {
    // image=($1),
    const query = `
    UPDATE recipes SET
        
        title=($1),
        ingredients=($2),
        preparation=($3),
        information=($4),
        chef_id=($5)
    WHERE id = $6
      `;

    const values = [
      // data.image,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.chef,
      data.id,
    ];

    db.query(query, values, function (err, results) {
      if (err) throw `Database Error! ${err}`;

      callback();
    });
  },
  delete(id, callback) {
    db.query(
      `DELETE FROM recipes WHERE id = $1`,
      [id],
      function (err, results) {
        if (err) throw `Database Error! ${err}`;

        return callback();
      }
    );
  },
  paginate(params) {
    const { limit, offset, callback } = params;

    let query = `
    SELECT recipes.*, (SELECT count(*) FROM recipes) AS total   
    FROM recipes
    GROUP BY recipes.id LIMIT $1 OFFSET $2
    `;

    db.query(query, [limit, offset], function (err, results) {
      if (err) throw `Database Error! ${err}`;

      callback(results.rows);
    });
  },
  files(id) {
    return db.query(
      `
      SELECT * FROM files_test WHERE recipe_id = $1
    `,
      [id]
    );
  },
};
