const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');

const RecipeController = require('../app/controllers/RecipeController');

routes.get('/', RecipeController.index);

routes.get('/create', RecipeController.create);
routes.get('/:id', RecipeController.show);
routes.get('/:id/edit', RecipeController.edit);

routes.post('/', multer.array('photos', 6), RecipeController.post);
routes.put('/', multer.array('photos', 6), RecipeController.put);
routes.delete('/', RecipeController.delete);

module.exports = routes;
