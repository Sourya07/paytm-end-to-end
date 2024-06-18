const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://singhpriyanshu8989:ORCJ2NXmvDQ8x3qH@cluster0.ho3emx3.mongodb.net/")

const userSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    password:String,
    username:String
})
const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const Account = mongoose.model('Account', accountSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
	User,
    Account
};