const express = require('express');
const routes = express.Router();

const site = require('./site');
const admin_recipes = require('./admin-recipes');
const admin_chefs = require('./admin-chefs');
const admin_users = require('./users');

routes.use('/', site);
routes.use('/admin/recipes', admin_recipes);
routes.use('/admin/chefs', admin_chefs);
routes.use('/admin/users', admin_users);

module.exports = routes;
