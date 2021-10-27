module.exports = {
  list(req, res) {
    return res.render('admin/users/list');
  },
  create(req, res) {
    return res.render('admin/users/create');
  },
};
