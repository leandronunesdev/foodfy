const { purge } = require('../../routes/users');
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
  async edit(req, res) {
    let results = await User.find(req.params.id);
    const user = results.rows[0];

    if (!user) return res.send('User not found!');

    return res.render('admin/users/edit.njk', { user });
  },
  async put(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == '' && key != 'removed_files') {
        return res.send('Please, fill all fields');
      }
    }

    await User.update(req.body, req.session.userId);
    return res.redirect('/admin/users');
  },
  async delete(req, res) {
    if (req.session.userId == req.body.id) {
      return res.send('You cant delete yourself');
    } else {
      await User.delete(req.body.id);
    }

    return res.redirect('/admin/users');
  },
};
