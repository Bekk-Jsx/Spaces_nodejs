const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { createDb } = require('../utils/CreateDB');


exports.getAll = (Model, params) => catchAsync(async (req, res, next) => {

    const found = await Model.findAll();
    const data = found.map(one => one.dataValues);

    res.status(201).json({
        status: "success",
        data
    });
});



exports.addOne = (Model, params) => catchAsync(async (req, res, next) => {


    if (params.createDb) {

        const db = await createDb(req.body.db_name, req.body.password);

        if (!db || db.status !== 201) {
            return next(new AppError('We have an error in our system, please try again later.', 500));
        }

        req.body.owner = req.user._id;

    }

    const data = await Model.create(req.body);

    res.status(201).json({
        status: "success",
        data: data.dataValues
    });
});