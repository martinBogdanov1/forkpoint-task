var express = require('express');
var router = express.Router();
const productService = require('../services/product');


/* GET home page. */
router.get('/', async function(req, res, next) {
  const product = await productService.getById('5172d203ffdd81f3234d5f8a');
  res.json(product);

});

module.exports = router;
