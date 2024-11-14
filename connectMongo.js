const mongoose = require("mongoose");
const connectToMongo = async (url) =>{
    mongoose.connect(url);
}

module.exports = connectToMongo;