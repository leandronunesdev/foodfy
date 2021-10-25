const Chef = require('../models/ChefModel');
const Recipe = require('../models/RecipeModel');
const File = require('../models/FileModel');
const RecipeFile = require('../models/RecipeFileModel');

module.exports = {
  home(req, res) {
    Recipe.all(function (recipes) {
      return res.render('site/pages/index', { recipes });
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
        return res.render('site/pages/recipes', { recipes, pagination });
      },
    };
    Recipe.paginate(params);
  },
  async detail(req, res) {
    let results = await Recipe.find(req.params.id);
    const recipe = results.rows[0];

    if (!recipe) return res.send('Receita não encontrada!');

    return res.render('site/pages/recipe', { recipe });
  },
  index(req, res) {
    Recipe.all(function (recipes) {
      return res.render('admin/recipes/index', { recipes });
    });
  },
  search(req, res) {
    let { filter } = req.query;

    Recipe.findBy(filter, function (recipes) {
      return res.render('site/pages/search', { recipes, filter });
    });
  },
  create(req, res) {
    Chef.all()
      .then(function (results) {
        const chefs = results.rows;

        return res.render('admin/recipes/create', { chefs });
      })
      .catch(function (err) {
        throw new Error(err);
      });
  },
  async show(req, res) {
    try {
      let results = await Recipe.find(req.params.id);
      const recipe = results.rows[0];

      if (!recipe) return res.send('Receita não encontrada!');

      results = await Recipe.files(recipe.id);

      const files = results.rows.map((file) => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace(
          'public',
          ''
        )}`,
      }));

      return res.render('admin/recipes/show', { recipe, files });
    } catch (err) {
      console.error(err);
    }
  },
  async post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == '') {
        return res.send('Por favor, preencha todos os campos');
      }
    }

    if (req.files.length == 0)
      return res.send('Please, send at least one image');

    let results = await Recipe.create(req.body);
    const recipeId = results.rows[0].id;

    const filesPromise = req.files.map(async (file) => {
      const results = await File.create(file);
      const file_id = results.rows[0].id;
      const data = {
        file_id,
        recipe_id: recipeId,
      };

      await RecipeFile.create(data);
    });

    await Promise.all(filesPromise);

    return res.redirect(`recipes/${recipeId}`);
  },
  async edit(req, res) {
    try {
      let results = await Recipe.find(req.params.id);
      const recipe = results.rows[0];

      if (!recipe) return res.send('Receita não encontrada!');

      results = await Chef.all();
      const chefs = results.rows;

      results = await Recipe.files(recipe.id);
      let files = results.rows;

      files = files.map((file) => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace(
          'public',
          ''
        )}`,
      }));

      return res.render('admin/recipes/edit', { recipe, chefs, files });
    } catch (err) {
      console.error(err);
    }
  },
  async put(req, res) {
    try {
      const keys = Object.keys(req.body);
      for (key of keys) {
        if (req.body[key] == '' && key != 'removed_files') {
          return res.send('Por favor, preencha ao menos um ingrediente');
        }
      }

      if (req.files.length != 0) {
        const newFilesPromise = req.files.map(async (file) => {
          const results = await File.create(file);
          const file_id = results.rows[0].id;
          const data = {
            file_id,
            recipe_id: req.body.id,
          };

          await RecipeFile.create(data);
        });

        await Promise.all(newFilesPromise);
      }

      if (req.body.removed_files) {
        const removedFiles = req.body.removed_files.split(',');
        const lastIndex = removedFiles.length - 1;
        removedFiles.splice(lastIndex, 1);

        console.log('teste', req.body.removed_files);

        const removedFilesPromise = removedFiles.map((id) => {
          RecipeFile.delete(id);
          File.delete(id);
        });

        await Promise.all(removedFilesPromise);
      }

      Recipe.update(req.body);
      return res.redirect(`recipes/${req.body.id}`);
    } catch (err) {
      console.error(err);
    }
  },

  delete(req, res) {
    Recipe.delete(req.body.id, function () {
      return res.redirect('/admin/recipes');
    });
  },
};
