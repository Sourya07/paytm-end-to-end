const express =require("express")
const app = express()
const router =express.Router();
const userRouter = require("./User")
const userRouter = require("./account")
app.use(router);


router.get('/user',userRouter)
router.get('/account',account)




module.exports = router