const express = require("express");
const app = express();
const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../db");
const JWT_SECRET = require("../config");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware");

const signupSchema = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
});

router.post("/signup", async (req, res) => {
    const body = req.body;
    
    // Validate the request body against the signup schema
    const { success, error } = signupSchema.safeParse(req.body);
    if (!success) {
        console.log("Validation failed:", error.errors);
        return res.status(400).json({
            message: "Invalid input",
            errors: error.errors
        });
    }

    try {
        // Check if the username already exists
        const user = await User.findOne({
            username: req.body.username
        });
        
        if (user) {
            console.log("Username already taken:", req.body.username);
            return res.status(400).json({
                message: "Username already taken"
            });
        }

        // Create a new user in the database
        const dbuser = await User.create(body);
        console.log("User created:", dbuser);

        const userId = dbuser._id;

        // Create an associated account with a random balance
        await Account.create({
            userId,
            balance: 1 + Math.random() * 10000
        });
        console.log("Account created for user:", userId);

        // Generate a JWT token
        const token = jwt.sign({
            userId: dbuser._id
        }, JWT_SECRET);

        // Respond with success message and token
        res.json({
            message: "User created successfully",
            token
        });

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

const signinBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),

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
    console.log(success)


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
