var express = require('express');
var router = express.Router();
const categoryService = require('../services/category');
const productService = require('../services/product');

/* GET home page. */
router.get('/products', async function (req, res) {
  const page = req.query.page;
  const categories = await categoryService.getAll();
  const products = await productService.getProductsWithLimit({}, page);

  res.render('index.ejs', { products, categories });
});

router.get('/:categoryId', async function (req, res) {
  const page = req.query.page;
  const primary_category_id = req.params.categoryId;
  const products = await productService.getProductsWithLimit({ primary_category_id }, page);
  const categories = await categoryService.getAll();

  res.render('index.ejs', { products, categories });
});


module.exports = router;
