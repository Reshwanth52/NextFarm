const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Please enter a UserName"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [5, "Name should have more than 4 characters"],
    },
    email: {
        type: String,
        required: [true, "Please enter an Email"],
        unique: [true, "Email already exist."],
        validate:[validator.isEmail, "Please Enter a valid Email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    userRole: {
        type: String,
        default: "ordinaryUser"
    },
    posts: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Post"
        }
    ],
    following: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
        }
    ],
    followers: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
        }
    ],
    contactNumber: {
        type: Number,
        length: [10, "Please enter a Valid Number"],
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

userSchema.methods.isMatchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.getJSONWebToken = async function (user_id) {

    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

userSchema.methods.getResetPasswordToken = function () {

    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken =crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

module.exports = mongoose.model('User', userSchema);