const mongoose = require('mongoose');
const dbConfig = require("../config/db");

const schema = new mongoose.Schema({
    name: {
        type: String,
        require
    },
    description: {
        type: String,
        require
    },
    file: {
        type: String,
        require
    },
    location: {
        type: String,
        require
    },
    likes: {
        type: Number,
        require
    },
    date: {
        type: String,
        require
    }
})

const postModel = mongoose.model(`${dbConfig.usrpost}`, schema)
module.exports = postModel;