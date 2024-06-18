const express =require("express")
const app = express()
const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../db");
const JWT_SECRET = require("../config");
const jwt = require("jsonwebtoken");
const  { authMiddleware } = require("../middleware");
const signupSchema = zod.object({
    username: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})


router.post("/signup", async(req,res)=>{
    const body =req.body
    const {success} = signupSchema.safeParse(req.body)
    console.log(success)
    if(!success){
        return res.json({
            message:"email already taken /incorrect outputs"
        })
    }
    
    const user = User.find({
        username: req.body.username
    })
    console.log(user._id)
    if(user){
        return res.json({
            message:"username already taken"
            })
    }

    const dbuser = await User.create(body);
    const userId=dbuser._id

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })
    const token =jwt.sign({
        userId:dbuser._id
    },JWT_SECRET)
 

    res.json({
        message:"user created successfully",
        token
    })
})


router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
})


router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


module.exports = router