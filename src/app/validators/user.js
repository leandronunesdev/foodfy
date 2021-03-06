const User = require('../models/UserModel');
// const { compare } = require('bcryptjs');

//check if has all fields
function checkAllFields(body) {
  const keys = Object.keys(body);
  for (key of keys) {
    if (body[key] == '') {
      return {
        user: body,
        error: 'Por favor, preencha todos os campos',
      };
    }
  }
}

async function show(req, res, next) {
  const { userId: id } = req.session;

  const user = await User.findOne({ where: { id } });

  if (!user)
    return res.render('user/register', {
      error: 'Usuário não encontrado',
    });

  req.user = user;

  next();
}

async function post(req, res, next) {
  //check if has all fields
  const fillAllFields = checkAllFields(req.body);
  if (fillAllFields) {
    return res.render('admin/users/create', fillAllFields);
  }
  //check if user exists [email, cpf_cnpj]
  let { email } = req.body;

  const user = await User.findOne({
    where: { email },
  });
  if (user)
    return res.render('admin/users/create', {
      user: req.body,
      error: 'Usuário já cadastrado',
    });
  //check if password match

  next();
}

async function update(req, res, next) {
  //check if has all fields
  const fillAllFields = checkAllFields(req.body);
  if (fillAllFields) {
    return res.render('admin/users/profile', fillAllFields);
  }

  const { id } = req.body;

  const user = await User.findOne({ where: { id } });

  req.user = user;

  next();
}

module.exports = {
  post,
  show,
  update,
};
