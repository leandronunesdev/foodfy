const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');
const RecipeController = require('../app/controllers/RecipeController');
const ChefController = require('../app/controllers/ChefController');

const site = require('./site');
const admin_recipes = require('./admin-recipes');
const admin_chefs = require('./admin-chefs');

routes.use('/', site);
routes.use('/admin/recipes', admin_recipes);
routes.use('/admin/chefs', admin_chefs);

module.exports = routes;
