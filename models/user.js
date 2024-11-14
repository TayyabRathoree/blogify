const mongoose = require("mongoose");
const { createHmac , randomBytes } = require("crypto");
const { createTokenUser } = require("../service/authentication");

const userSchema = new mongoose.Schema({
    fullname: {
        type:String,
        required:true,
    },
    email :{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profileImageUrl:{
        type:String,
        default:"https://cdn.iconscout.com/icon/free/png-512/avatar-370-456322.png"

    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER",
    }
},{
    timestamps : true,
});

userSchema.pre("save", function(next) {
    const user = this;
    
    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString('hex');
    const hashedPassword = createHmac("sha256",salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();


})

userSchema.static("matchPasswordAndGenerateToken", async function (email,password) {
    const user = await this.findOne({email});
    if(!user)  throw new Error("User not found!!");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedPassHash = createHmac("sha256",salt).update(password).digest("hex");

    if(userProvidedPassHash !== hashedPassword) throw new Error("Incorrect Password");

    const token = createTokenUser(user);

    return token ;
})

const User = mongoose.model("User",userSchema);
module.exports = User;