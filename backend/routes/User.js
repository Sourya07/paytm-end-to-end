const express =require("express")
const app = express()
const router = express.Router();
const zod = require("zod");
const { User } = require("../db");
const JWT_SECRET = require("../config");
const jwt = require("jsonwebtoken");

const signupSchema=zod.object({
    username:zod.string().email(),
    password:zod.string(),
    firstName:zod.string(),
    lastName:zod.string(),

})

router.post("/signup", async(req,res)=>{
    const body =req.body
    const {succes} = signupSchema.safeParse(req.body)
    if(!succes){
        return res.json({
            message:"email already taken /incorrect outputs"
        })
    }
    const user = User.findOne({
        username: body.username
    })
    if(User._id){
        return res.json({
            message:"username already taken"
            })
    }

    const dbuser = await User.create(body);
    const token =jwt.sign({
        userId:dbuser._id
    },JWT_SECRET)
    res.json({
        message:"user created successfully",
        token
    })
})


module.exports = router