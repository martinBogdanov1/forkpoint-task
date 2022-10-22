var express = require('express');
var router = express.Router();
const categoryService = require('../services/category');


/* GET home page. */
router.get('/', async function (req, res, next) {
  const categories = await categoryService.getAll();
  res.render('index.ejs', { categories });
});

module.exports = router;
