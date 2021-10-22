const express = require('express');
const routes = express.Router();
const multer = require('./app/middlewares/multer');
const recipes = require('./app/controllers/recipes');
const chefs = require('./app/controllers/chefs');

// PORTAL

routes.get('/', recipes.home);
routes.get('/recipes', recipes.list);
routes.get('/recipes/:id', recipes.detail);
routes.get('/search', recipes.search);
routes.get('/chefs', chefs.list);
routes.get('/about', function (req, res) {
  return res.render('portal/about');
});

// ADMIN - RECIPES

routes.get('/admin/recipes', recipes.index);

routes.get('/admin/recipes/create', recipes.create);
routes.get('/admin/recipes/:id', recipes.show);
routes.get('/admin/recipes/:id/edit', recipes.edit);

routes.post('/admin/recipes', multer.array('photos', 6), recipes.post);
routes.put('/admin/recipes', multer.array('photos', 6), recipes.put);
routes.delete('/admin/recipes', recipes.delete);

// ADMIN - CHEFS

routes.get('/admin/chefs', chefs.index);
routes.get('/admin/chefs/create', function (req, res) {
  return res.render('chefs/create');
});
routes.post('/admin/chefs', chefs.post);
routes.get('/admin/chefs/:id', chefs.show);
routes.get('/admin/chefs/:id/edit', chefs.edit);
routes.put('/admin/chefs', chefs.put);
routes.delete('/admin/chefs', chefs.delete);

module.exports = routes;
