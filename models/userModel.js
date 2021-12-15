const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A user name must have less or equal then 40 characters'],
        minlength: [10, 'A user name must have more or equal then 10 characters']
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'A user must confirm password'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'passwords are not the same'
        }
    },
    passwordChangedAt: Date
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}


userSchema.methods.changedPasswordAfter = function (JWTTimesstamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimesstamp < changedTimestamp;
    }
    return false;
}
const User = mongoose.model('User', userSchema);

module.exports = User;
