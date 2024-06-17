const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://singhpriyanshu8989:ORCJ2NXmvDQ8x3qH@cluster0.ho3emx3.mongodb.net/")

const userSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    password:String,
    username:String
})

const User = new mongoose.model("User",userSchema)

module.exports={
  User
   }
   