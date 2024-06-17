const express =require("express")
const app = express()
const router =express.Router();
const userRouter = require("./User")
app.use(router);


router.get('/user',userRouter)





module.exports = router