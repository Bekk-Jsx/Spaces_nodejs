const usersModel = require('../Models/mainUsersModel');
const mainModel = require('../Models/mainModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require("jsonwebtoken");
const AppError = require('./../utils/appError');
const bcrypt = require("bcryptjs");
const { promisify } = require('util');




const { Sequelize } = require('sequelize');


// functions

const signToken = user => {
    return jwt.sign({
        id: user._id,
        email: user.email,
        username: user.username,

    },
        process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    }
    );
};

const createSendToken = (req, res, result, code) => {

    const token = signToken(result);


    // Remove password from output
    result.password = undefined;


    res.status(code).json({
        status: "success",
        token,
        data: result
    });
}


//signup

exports.signUp = catchAsync(async (req, res, next) => {

    const user = await usersModel.create(req.body);

    createSendToken(req, res, user.dataValues, 201);

})

exports.login = catchAsync(async (req, res, next) => {



    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }



    // 2) Check if user exists && password is correct
    const data = await usersModel.findOne({ where: { email } });
    const user = data ? data.dataValues : null;



    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }



    // 3) If everything ok, send token to client
    createSendToken(req, res, user, 200);

});

exports.isMainAdmin = catchAsync(async (req, res, next) => {



    // 1) Getting token and check of it's there
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    } else {
        token = req.body.token;
    }

    if (!token) {
        return next(
            new AppError('You are not logged in! Please log in to get access.', 401)
        );
    }




    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await usersModel.findOne({ where: { _id: decoded.id } })



    if (!currentUser || !currentUser.dataValues) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist.',
                401
            )
        );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser.dataValues;


    next();

})