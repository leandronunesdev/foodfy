function onlyUsers(req, res, next) {
  if (!req.session.userId) return res.redirect('/admin/users/login');
  next();
}

function isLoggedRedirectToUsers(req, res, next) {
  if (req.session.userId) return res.redirect('/users');
  next();
}

function onlyAdmins(req, res, next) {
  if (!req.session.isAdmin) return res.redirect('/admin/recipes');
  next();
}

module.exports = {
  onlyUsers,
  isLoggedRedirectToUsers,
  onlyAdmins,
};
