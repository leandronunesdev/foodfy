const express = require('express');
const routes = express.Router();

const SessionController = require('../app/controllers/SessionController');
const SessionValidator = require('../app/validators/session');
const UserController = require('../app/controllers/UserController');

const {
  isLoggedRedirectToUsers,
  onlyUsers,
} = require('../app/middlewares/session');

// //login/logout
routes.get('/login', SessionController.loginForm);
routes.post('/login', SessionValidator.login, SessionController.login);
routes.post('/logout', SessionController.logout);

// // //reset password/forgot
// routes.get('/forgot-password', SessionController.forgotForm);
// routes.get('/password-reset', SessionController.resetForm);
// routes.post(
//   '/forgot-password',
//   SessionValidator.forgot,
//   SessionController.forgot
// );
// routes.post('/password-reset', SessionValidator.reset, SessionController.reset);

// // Rotas de perfil de um usuário logado
// routes.get('/admin/profile', ProfileController.index); // Mostrar o formulário com dados do usuário logado
// routes.put('/admin/profile', ProfileController.put); // Editar o usuário logado

// // Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/', onlyUsers, UserController.list); // Mostrar a lista de usuários cadastrados
routes.get('/create', onlyUsers, UserController.create); // Mostrar o formulário de criação de um usuário
routes.post('/', UserController.post); // Cadastrar um usuário
// routes.put('/admin/users/:id', UserController.put); // Editar um usuário
// routes.get('/admin/users/:id/edit', UserController.edit); // Mostrar o formulário de edição de um usuário
// routes.delete('/admin/users/:id', UserController.delete); // Deletar um usuário

module.exports = routes;
