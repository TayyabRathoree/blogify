const {model ,Schema } = require("mongoose");


const blogSchema = new Schema({
     title:{
        type:String,
        required:true,
     },
     body:{
        type:String,
        required:true,
     },
     coverImageUrl: {
        type: String,
        required:false,
     },
     createdBy : {
        type: Schema.Types.ObjectId,
        ref:"User",
     }
});

const Blog = model("blog",blogSchema);

module.exports = Blog ;