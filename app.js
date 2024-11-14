require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const engine = require("ejs-mate");
const connectToMongo = require("./connectMongo");
const cookieParser = require("cookie-parser");

const Blog = require("./models/blog");
const Comment = require("./models/comment");

const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const { checkForAuthCookie,checkForIsUserSignin } = require("./middleware/auth");


const port = process.env.PORT || 8080;


connectToMongo(process.env.MONGO_URL).then(() => {
    console.log("Connected to Database");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.engine("ejs", engine);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthCookie("token"));
app.use(express.static(path.join(__dirname,"/public")));

// Middleware to set res.locals.user
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.error = null;
    next();
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);


app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
    res.render("home", {
        user: req.user,
        blogs:allBlogs,
    });
});

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
