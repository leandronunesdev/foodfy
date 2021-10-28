const db = require('../../config/db');
const crypto = require('crypto');
const mailer = require('../../lib/mailer');

module.exports = {
  async create(data) {
    try {
      const query = `
        INSERT INTO users (
          name,
          email,
          password,
          is_admin
        ) VALUES ($1, $2, $3, $4)
        RETURNING id
      `;

      const password = crypto.randomBytes(10).toString('hex');

      const values = [data.name, data.email, password, data.is_admin];

      await mailer.sendMail({
        to: data.email,
        from: 'no-reply@foodfy.com',
        subject: 'Bem vindo ao Foodfy!',
        html: `
        <h2>Seus dados de acesso</h2>
        <p>E-mail: ${data.email}</p>
        <p>Senha: ${password}</p>
        <a href="http://localhost:3000/admin/users" target="_blank">
          Acessar Conta
        </a>       
        `,
      });

      return db.query(query, values);
    } catch (err) {
      console.error(err);
    }
  },
  list() {
    return db.query(
      `
      SELECT * FROM users
      `
    );
  },
  async findOne(filters) {
    let query = 'SELECT * FROM users';

    Object.keys(filters).map((key) => {
      //WHERE OR AND
      query = `${query}
          ${key}
          `;

      Object.keys(filters[key]).map((field) => {
        query = `${query} ${field} = '${filters[key][field]}'`;
      });
    });
    const results = await db.query(query);
    return results.rows[0];
  },
  find(id) {
    return db.query('SELECT * FROM users WHERE id = $1', [id]);
  },
  async update(data) {
    const query = `
      UPDATE users SET                
        name=($1),
        email=($2),
        is_admin=($3)        
      WHERE id = $4
    `;

    const values = [data.name, data.email, data.is_admin, data.id];

    return db.query(query, values);
  },
  delete(id) {
    return db.query(`DELETE FROM users WHERE id = $1`, [id]);
  },
};
