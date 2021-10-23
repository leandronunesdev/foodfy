const Chef = require('../models/ChefModel');

module.exports = {
  list(req, res) {
    Chef.all()
      .then(function (results) {
        const chefs = results.rows;

        return res.render('site/pages/chefs', { chefs });
      })
      .catch(function (err) {
        throw new Error(err);
      });
  },
  index(req, res) {
    Chef.all()
      .then(function (results) {
        const chefs = results.rows;

        return res.render('admin/chefs/index', { chefs });
      })
      .catch(function (err) {
        throw new Error(err);
      });
  },
  show(req, res) {
    Chef.find(req.params.id, function (chef) {
      if (!chef) return res.send('Chef não encontrado!');

      Chef.findChefRecipes(req.params.id, function (recipes) {
        return res.render('admin/chefs/show', { chef, recipes });
      });
    });
  },
  post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == '') {
        return res.send('Por favor, preencha ao menos um ingrediente');
      }
    }
    Chef.create(req.body, function (chef) {
      return res.redirect(`admin/chefs/${chef.id}`);
    });
  },
  edit(req, res) {
    Chef.find(req.params.id, function (chef) {
      if (!chef) return res.send('Chef not found!');
      return res.render('admin/chefs/edit', { chef });
    });
  },
  put(req, res) {
    const keys = Object.keys(req.body);
    for (key of keys) {
      if (req.body[key] == '') {
        return res.send('Por favor, preencha todos os campos');
      }
    }

    Chef.update(req.body, function () {
      return res.redirect(`/admin/chefs/${req.body.id}`);
    });
  },
  delete(req, res) {
    Chef.find(req.body.id, function (chef) {
      if (chef.total_recipes >= 1) {
        return res.send('Chef com receita não pode ser deletado');
      } else {
        Chef.delete(req.body.id, function () {
          return res.redirect('/admin/chefs');
        });
      }
    });
  },
};
