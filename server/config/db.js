const mongoose = require('mongoose');

const db = async () => {
    try {
        await mongoose.connect(process.env.URL);
        console.log("MongoDB CONNECTED");
    } catch (error) {
        console.log("MongoDB Dis-CONNECTION", error);
    }
};

module.exports = db;
