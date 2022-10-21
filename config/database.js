const mongoose = require('mongoose');

module.exports = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect('mongodb://127.0.0.1:27017/store', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const db = mongoose.connection;
        db.on('error', (err) => {
            console.log('connection error', err);
            reject(err);
        });
        db.once('open', () => {
            console.log('database ready');
            resolve();
        });
    });
}