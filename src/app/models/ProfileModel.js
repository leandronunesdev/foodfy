const db = require('../../config/db');
const crypto = require('crypto');
const mailer = require('../../lib/mailer');

module.exports = {
  async update(id, fields) {
    let query = 'UPDATE users SET';

    Object.keys(fields).map((key, index, array) => {
      if (index + 1 < array.length) {
        query = `${query}
          ${key} = '${fields[key]}',        
        `;
      } else {
        //last iteration
        query = `${query}
          ${key} = '${fields[key]}'  
          WHERE id = ${id}      
        `;
      }
    });

    await db.query(query);
    return;
  },
};
