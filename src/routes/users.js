const express = require('express');
const routes = express.Router();

const SessionController = require('../app/controllers/SessionController');
const SessionValidator = require('../app/validators/session');
const UserController = require('../app/controllers/UserController');

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
// routes.get('/admin/profile', ProfileController.index); // Mostrar o formulário com dados do usuário logado
// routes.put('/admin/profile', ProfileController.put); // Editar o usuário logado

// // Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/', onlyUsers, UserController.list); // Mostrar a lista de usuários cadastrados
routes.get('/create', onlyUsers, onlyAdmins, UserController.create); // Mostrar o formulário de criação de um usuário
routes.post('/', UserController.post); // Cadastrar um usuário
routes.get('/:id/edit', UserController.edit); // Mostrar o formulário de edição de um usuário
routes.put('/', UserController.put); // Editar um usuário
routes.delete('/', UserController.delete); // Deletar um usuário

module.exports = routes;
