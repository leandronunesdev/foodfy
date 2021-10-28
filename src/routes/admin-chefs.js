const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');

const ChefController = require('../app/controllers/ChefController');

const {
  isLoggedRedirectToUsers,
  onlyUsers,
} = require('../app/middlewares/session');

routes.get('/', onlyUsers, ChefController.index);
routes.get('/create', onlyUsers, function (req, res) {
  return res.render('admin/chefs/create');
});
routes.post('/', multer.array('photos', 5), ChefController.post);
routes.get('/:id', onlyUsers, ChefController.show);
routes.get('/:id/edit', onlyUsers, ChefController.edit);
routes.put('/', multer.array('photos', 5), ChefController.put);
routes.delete('/', ChefController.delete);

module.exports = routes;
