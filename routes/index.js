var express = require('express');
var router = express.Router();
const categoryService = require('../services/category');
const productService = require('../services/product');

/* GET home page. */
router.get('/', async function (req, res) {
  const page = req.query.page;
  const query = Object.entries(req.query);
  const filter = parseQuery(query);

  const categories = await categoryService.getAll();
  const filters = await productService.getFilters();
  const products = await productService.getProductsWithLimit(filter, page);

  const currentUrl = req.originalUrl;

  const nextPage = getNextPage(currentUrl, products.currentPage);
  const previousPage = getPreviousPage(currentUrl, products.currentPage);

  res.render('index.ejs', { products, categories, filters, nextPage, previousPage });
});

/* GET category page. */
router.get('/:categoryId', async function (req, res) {
  const page = req.query.page;
  const primary_category_id = req.params.categoryId;
  const query = Object.entries(req.query);
  const filter = parseQuery(query, primary_category_id);

  const categories = await categoryService.getAll();
  const products = await productService.getProductsWithLimit(filter, page);
  const filters = await productService.getFilters(primary_category_id);

  const currentUrl = req.originalUrl;

  const nextPage = getNextPage(currentUrl, products.currentPage);
  const previousPage = getPreviousPage(currentUrl, products.currentPage);

  res.render('index.ejs', { products, categories, filters, nextPage, previousPage });
});


function parseQuery(query, categoryId) {
  let filter = {};

  if (categoryId) {
    filter = { primary_category_id: categoryId };
  }

  if (query.length > 0) {
    filter['$and'] = [];

    query.forEach(q => {
      const filterId = q[0];
      const filterValue = q[1];

      if (filterId != 'page') {
        filter.$and.push({
          variation_attributes: {
            $elemMatch: { id: filterId, values: { $elemMatch: { name: filterValue } } }
          }
        });
      }
    });
  }

  if (filter.$and?.length === 0) {
    delete filter.$and;
  }

  return filter;
}

function getNextPage(currentPath, currentPage) {
  if (currentPath.includes('page')) {
    currentPath = currentPath.replace(`page=${currentPage}`, `page=${currentPage + 1}`);
  } else {
    if (currentPath.includes('?')) {
      currentPath += `&page=${currentPage + 1}`;
    } else {
      currentPath += `?page=${currentPage + 1}`;
    }
  }

  return currentPath;
}

function getPreviousPage(currentPath, currentPage) {
  if (currentPath.includes('page') && currentPage > 1) {
    currentPath = currentPath.replace(`page=${currentPage}`, `page=${currentPage - 1}`);
  } 

  return currentPath;
}

module.exports = router;
