const Model = require('../Models/mainUsersModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require("./handleFactory");


exports.getAllMainUsers = factory.getAll(Model, {});