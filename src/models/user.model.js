import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        //true is to specify this type is required, and the message will pop up when it is voilated
        required: [true, "Please provide a username"],          
        unique: [true, "This username is already taken"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide an password"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date
})

//return existing model if present, else create a new one
const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User