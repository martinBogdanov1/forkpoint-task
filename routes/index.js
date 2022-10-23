var express = require('express');
var router = express.Router();
const categoryService = require('../services/category');
const productService = require('../services/product');

/* GET home page. */
router.get('/products', async function (req, res) {
  const page = req.query.page;
  const categories = await categoryService.getAll();
  const products = await productService.getProductsWithLimit({}, page);
  const filters = await productService.getFilters();

  res.render('index.ejs', { products, categories, filters });
});

/* GET category page. */
router.get('/:categoryId', async function (req, res) {
  const page = req.query.page;
  const primary_category_id = req.params.categoryId;
  const products = await productService.getProductsWithLimit({ primary_category_id }, page);
  const categories = await categoryService.getAll();

  res.render('index.ejs', { products, categories });
});

router.post('/products', async function (req, res) {
  console.log(req.body);
  res.end();
})


module.exports = router;
