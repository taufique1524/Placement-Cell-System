const mongoose = require('mongoose');

async function dbConnection() {
    try {
        const url = process.env.MONGO_DB_URL
        await mongoose.connect(url);
    }
    catch (err) {
    }
}

exports.dbConnection = dbConnection;

