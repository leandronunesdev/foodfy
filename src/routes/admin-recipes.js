const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');

const RecipeController = require('../app/controllers/RecipeController');

const { onlyUsers, onlyAdmins } = require('../app/middlewares/session');

routes.get('/', onlyUsers, RecipeController.index);

routes.get('/create', onlyUsers, onlyAdmins, RecipeController.create);
routes.get('/:id', onlyUsers, RecipeController.show);
routes.get('/:id/edit', onlyUsers, onlyAdmins, RecipeController.edit);

routes.post('/', multer.array('photos', 5), RecipeController.post);
routes.put('/', multer.array('photos', 5), RecipeController.put);
routes.delete('/', RecipeController.delete);

module.exports = routes;
