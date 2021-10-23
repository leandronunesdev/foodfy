const express = require('express');
const routes = express.Router();

const RecipeController = require('../app/controllers/RecipeController');
const ChefController = require('../app/controllers/ChefController');

routes.get('/', RecipeController.home);
routes.get('/recipes', RecipeController.list);
routes.get('/recipes/:id', RecipeController.detail);
routes.get('/search', RecipeController.search);
routes.get('/chefs', ChefController.list);
routes.get('/about', function (req, res) {
  return res.render('site/pages/about');
});

module.exports = routes;
