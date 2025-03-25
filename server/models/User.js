const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     email: Email,
//     password: String
// });

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("taskSign", userSchema);
