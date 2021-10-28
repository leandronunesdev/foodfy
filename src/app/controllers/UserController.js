const User = require('../models/UserModel');

module.exports = {
  async list(req, res) {
    const results = await User.list();
    const users = results.rows;

    return res.render('admin/users/list', { users });
  },
  create(req, res) {
    return res.render('admin/users/create');
  },
  post(req, res) {
    User.create(req.body);

    return res.redirect('/admin/users');
  },
};
