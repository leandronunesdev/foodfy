const Profile = require('../models/UserModel');

module.exports = {
  async index(req, res) {
    const { user } = req;
    const isAdmin = req.session.userId;

    return res.render('admin/users/profile', { user, isAdmin });
  },
  async put(req, res) {
    try {
      const { user } = req;
      let { name, email } = req.body;

      await Profile.update(user.id, {
        name,
        email,
      });

      const isAdmin = req.session.userId;

      return res.render('admin/users/profile', {
        user: req.body,
        success: 'Conta atualizada com sucesso!',
        isAdmin,
      });
    } catch (err) {
      console.error(err);
      return res.render('admin/users/profile', {
        user: req.body,
        error: 'Algum erro aconteceu!',
        isAdmin,
      });
    }
  },
};
