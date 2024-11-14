const {model ,Schema } = require("mongoose");

const commentSchema = new Schema({
    content:{
        type:String,
        require:true,
    },

    blogId:{
        type: Schema.Types.ObjectId,
        ref:"blog",
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref:"User",
    },
},{timestamps:true});

 
const Comment = model("Comment",commentSchema);

module.exports = Comment ;