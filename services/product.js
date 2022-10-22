const Product = require('../models/Product');

async function getProductsWithLimit(filter = {}, page = 1, limit = 16) {
    page = Number(page)

    const products = await Product.find(filter)
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

    const count = await Product.countDocuments(filter);
    return {
        items: transferDetailsForDisplay(products),
        totalPages: Math.ceil(count / limit),
        currentPage: page
    }
}

function transferDetailsForDisplay(products) {
    return products.map(product => {
        return {
            name: product.name,
            price: product.price,
            price_max: product.price_max,
            price: product.price,
            image: product.image_groups.filter(img => img.view_type == 'large')[0].images[0].link
        }
    });
};


module.exports = {
    getProductsWithLimit
};