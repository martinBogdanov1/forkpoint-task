const Category = require('../models/Category');

async function getAll() {
    return await Category.find({}).lean();
}

module.exports = {
    getAll
};