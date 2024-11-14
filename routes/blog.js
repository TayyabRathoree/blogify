const { Router } = require("express");
const router = Router();
const Blog = require("../models/blog");
const multer = require("multer");
const path = require("path");
const Comment = require("../models/comment");

let storage = multer.diskStorage({
    destination: function (req,file,cb){
       cb(null,path.join(__dirname,`../public/uploads`))
    },
    filename: function (req,file,cb){
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null,fileName);
    }
});

const upload = multer({storage : storage});

router.get("/add-new", (req,res) =>{
    return res.render("addBlog",{
        user:req.user,
    })
});

router.post("/add-new", upload.single("coverImageUrl"), async(req,res) =>{
    const {title,body} = req.body;
   let blog =  await Blog.create({
         body,
         title,
         createdBy:req.user._id,
         coverImageUrl: `/uploads/${req.file.filename}`,
    })

    res.redirect(`/blog/${blog._id}`)
});

router.get("/my-blog/:id", async (req,res) =>{
    const {id} = req.params;
    const allBlogs = await Blog.find({createdBy : id});
    res.render("myblog",{allBlogs});
})


router.get("/:id", async (req,res) =>{
    const {id} = req.params;
    const blog = await Blog.findById(id).populate("createdBy");
    const comments = await Comment.find({blogId:id}).populate("createdBy");
    return res.render("blog",{
        blog,
        comments,
    })
})

router.post("/:id/comment",async (req,res) =>{
    const {id} = req.params;
    const {content} = req.body;

    await Comment.create({
         content:content,
         blogId : id,
         createdBy:req.user._id,
    });
    return res.redirect(`/blog/${id}`)
})


module.exports = router;