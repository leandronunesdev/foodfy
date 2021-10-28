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

async function update(req, res, next) {
  //check if has all fields
  const fillAllFields = checkAllFields(req.body);
  if (fillAllFields) {
    return res.render('admin/users/profile', fillAllFields);
  }

  const { id, password } = req.body;
  if (!password)
    return res.render('admin/users/profile', {
      user: req.body,
      error: 'Coloque sua senha para atualizar seu cadastro',
    });

  const user = await User.findOne({ where: { id } });

  // const passed = await compare(password, user.password);
  const passed = password === user.password;

  if (!passed)
    return res.render('admin/users/profile', {
      user: req.body,
      error: 'Senha incorreta',
    });

  req.user = user;

  next();
}

module.exports = {
  show,
  update,
};
