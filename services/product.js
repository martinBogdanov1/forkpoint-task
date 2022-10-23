const Product = require('../models/Product');

async function getProductsWithLimit(filter = {}, page = 1, limit = 16) {
    page = Number(page)

    const products = await Product.find(filter)
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

    const count = await Product.countDocuments(filter);
    return {
        items: transformDetailsForDisplay(products),
        totalPages: Math.ceil(count / limit),
        currentPage: page
    }
}

async function getFilters() {
    const variationAttributes = await Product
        .find({ variation_attributes: { $ne: null } })
        .lean();

    let attributesValues = [];
    variationAttributes.map(attributes => {
        attributes.variation_attributes.forEach(item => {
            const valuesIndex = attributesValues.findIndex(x => (x.id == item.id));
            if (valuesIndex <= -1) {
                attributesValues.push({ id: item.id, values: [] });
            }

            attributesValues.forEach(attributeValue => {
                item.values.forEach(itemValue => {
                    const valueIndex = attributeValue.values.indexOf(itemValue.name);
                    if (item.id === attributeValue.id && valueIndex == -1) {
                        attributeValue.values.push(itemValue.name);
                    }
                });
            });
        });
    });
    return attributesValues;
}

function transformDetailsForDisplay(products) {
    return products.map(product => {
        return {
            name: product.name,
            price: product.price,
            price_max: product.price_max,
            price: product.price,
            image: product.image_groups.filter(img => img.view_type == 'large')[0].images[0].link,
            filters: product.variation_attributes
        }
    });
};

module.exports = {
    getProductsWithLimit,
    getFilters
};