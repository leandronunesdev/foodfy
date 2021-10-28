const express = require('express');
const routes = express.Router();

const SessionValidator = require('../app/validators/session');
const UserValidator = require('../app/validators/user');
const ProfileValidator = require('../app/validators/profile');

const SessionController = require('../app/controllers/SessionController');
const UserController = require('../app/controllers/UserController');
const ProfileController = require('../app/controllers/ProfileController');

const {
  isLoggedRedirectToUsers,
  onlyUsers,
  onlyAdmins,
} = require('../app/middlewares/session');

// //login/logout
routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm);
routes.post('/login', SessionValidator.login, SessionController.login);
routes.post('/logout', SessionController.logout);

// // //reset password/forgot
routes.get('/forgot-password', SessionController.forgotForm);
routes.post(
  '/forgot-password',
  SessionValidator.forgot,
  SessionController.forgot
);
routes.get('/password-reset', SessionController.resetForm);
routes.post('/password-reset', SessionValidator.reset, SessionController.reset);

// // Rotas de perfil de um usuário logado
routes.get('/profile', ProfileValidator.show, ProfileController.index); // Mostrar o formulário com dados do usuário logado
routes.put('/profile', ProfileValidator.update, ProfileController.put); // Editar o usuário logado

// // Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/', onlyUsers, onlyAdmins, UserController.list); // Mostrar a lista de usuários cadastrados
routes.get('/create', onlyUsers, onlyAdmins, UserController.create); // Mostrar o formulário de criação de um usuário
routes.post('/', UserValidator.post, UserController.post); // Cadastrar um usuário
routes.get('/:id/edit', onlyUsers, onlyAdmins, UserController.edit); // Mostrar o formulário de edição de um usuário
routes.put('/', UserValidator.update, UserController.put); // Editar um usuário
routes.delete('/', UserController.delete); // Deletar um usuário

module.exports = routes;
