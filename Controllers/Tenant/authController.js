const mainModel = require('../../Models/mainModel');
const connectModel = require('../../Models/Tenant/usersModel');
const connectModelInvite = require('../../Models/Tenant/inviteModel');


const jwt = require("jsonwebtoken");
const AppError = require('./../../utils/appError');
const bcrypt = require("bcryptjs");
const catchAsync = require('./../../utils/catchAsync');
const { promisify } = require('util');


const progresqlConection = require('../../Tenant/connection');



// functions

const signToken = user => {
    return jwt.sign({
        id: user._id,
        email: user.email,
        lastname: user.lastname,
        firstname: user.firstname,

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





exports.signUp = catchAsync(async (req, res, next) => {


    const worlds = await mainModel.findOne({ where: { _id: req.body.world } });
    const current = worlds && worlds.dataValues ? worlds.dataValues : null;

    if (!current) {
        return next(new AppError('World cannot be found, please try again with valid world.', 500));
    }

    // Connect Current space

    process.env.DB_TENANT_NAME = current.db_name;
    process.env.DB_TENANT_PASSWORD = current.db_name;

    await progresqlConection();

    // Check valid user

    const inviteModel = await connectModelInvite();
    const found = await inviteModel.findAll({ where: { email: req.body.email } });
    const data = found.map(one => one.dataValues);

    if (!data || data.length === 0) {
        return next(new AppError('You do not have access to signup in this world, please try again later.', 404));
    }

    let spaces = [];
    let topics = [];

    for (let i = 0; i < data.length; i++) {

        if (data[i].type === 'space') {
            spaces.push({ space: data[i].space, database: current._id });
        } else if (data[i].type === 'topic') {
            topics.push({ topic: data[i]._id, space: data[i].space, database: current._id });
        }

    }

    req.body.spaces = spaces;
    req.body.topics = topics;



    const Model = connectModel();
    const user = await Model.create(req.body);

    createSendToken(req, res, user, 201)

});