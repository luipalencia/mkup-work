const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError')
const { promisify } = require('util')


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}
exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id)

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // 1 check email and password
    if (!email || !password) {
        next(new AppError('Please provide email and password', 400));
    }
    // 2 check if users exists && password is correct
    const user = await User.findOne({ email }).select('+password')
    const correct = await user.correctPassword(password, user.password)

    if (!user || !correct) {
        return next(new AppError('Incorrect email or passsword', 401))
    }
    // 3 if everything ok, send token
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token,
    });
})

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access', 401))
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const freshUser = await User.findById(decoded.id);

    if (!freshUser) {
        return next(new AppError('The user belonging to this token does no longer exists', 401))
    }

    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password, please log in again', 401))
    }

    req.user = freshUser;
    next();
})