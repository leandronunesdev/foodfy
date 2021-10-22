const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe');
const File = require('../models/File');

module.exports = {
  home(req, res) {
    Recipe.all(function (recipes) {
      return res.render('portal/index', { recipes });
    });
  },
  list(req, res) {
    let { page, limit } = req.query;

    page = page || 1;
    limit = limit || 2;
    let offset = limit * (page - 1);

    const params = {
      page,
      limit,
      offset,
      callback(recipes) {
        let total = 0;
        if (recipes[0]) {
          total = Math.ceil(recipes[0].total / limit);
        }
        const pagination = {
          total,
          page,
        };
        return res.render('portal/recipes', { recipes, pagination });
      },
    };
    Recipe.paginate(params);
  },
  detail(req, res) {
    Recipe.find(req.params.id, function (recipe) {
      if (!recipe) return res.render('not-found');
      return res.render('portal/recipe', { recipe });
    });
  },
  index(req, res) {
    Recipe.all(function (recipes) {
      return res.render('admin/index', { recipes });
    });
  },
  search(req, res) {
    let { filter } = req.query;

    Recipe.findBy(filter, function (recipes) {
      return res.render('portal/search', { recipes, filter });
    });
  },
  create(req, res) {
    Chef.all()
      .then(function (results) {
        const chefs = results.rows;

        return res.render('recipes/create.njk', { chefs });
      })
      .catch(function (err) {
        throw new Error(err);
      });
  },
  async show(req, res) {
    let results = await Recipe.find(req.params.id);
    const recipe = results.rows[0];

    if (!recipe) return res.send('Product not found!');

    results = await Recipe.files(recipe.id);
    const files = results.rows.map((file) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        'public',
        ''
      )}`,
    }));

    return res.render('recipes/show', { recipe, files });
    // Recipe.find(req.params.id, function (recipe) {
    //   if (!recipe) return res.send('Recipe not found!');
    //   return res.render('recipes/show', { recipe });
    // });
  },
  async post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == '') {
        return res.send('Por favor, preencha ao menos um ingrediente');
      }
    }

    if (req.files.length == 0)
      return res.send('Please, send at least one image');

    let results = await Recipe.create(req.body);
    const recipeId = results.rows[0].id;

    const filesPromise = req.files.map((file) =>
      File.create({ ...file, recipe_id: recipeId })
    );
    await Promise.all(filesPromise);

    return res.redirect(`recipes/${recipeId}`);
  },
  edit(req, res) {
    Recipe.find(req.params.id, function (recipe) {
      if (!recipe) return res.send('Recipe not found!');

      Recipe.chefsSelectOptions(function (options) {
        return res.render('recipes/edit', { recipe, chefsOptions: options });
      });
    });
  },
  put(req, res) {
    const keys = Object.keys(req.body);
    for (key of keys) {
      if (req.body[key] == '') {
        return res.send('Por favor, preencha ao menos um ingrediente');
      }
    }

    Recipe.update(req.body, function () {
      return res.redirect(`/admin/recipes/${req.body.id}`);
    });
  },
  delete(req, res) {
    Recipe.delete(req.body.id, function () {
      return res.redirect('/admin/recipes');
    });
  },
};
