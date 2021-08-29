const catchAsync = require('../../utils/catchAsync');
const mainModel = require('../../Models/mainModel');

const progresqlConection = require('../../Tenant/connection');
const connectModelSpace = require('../../Models/Tenant/spacesModel');
const connectModel = require('../../Models/Tenant/topicsModel');

const AppError = require('../../utils/AppError');


exports.getAll = catchAsync(async (req, res, next) => {



    const found = await mainModel.findOne({ where: { owner: req.user._id, _id: req.query.database } });
    if (!found) {
        return next(new AppError('Database cannot be found, please try again with valid database.', 500));
    }
    const data = found.dataValues;



    // Connect data base
    process.env.DB_TENANT_NAME = data.db_name;
    process.env.DB_TENANT_PASSWORD = data.db_name;

    await progresqlConection();



    const topicsModel = await connectModel();
    const foundTopics = await topicsModel.findAll({ where: { space: req.query.space } });
    const topics = foundTopics.map(one => one.dataValues);


    res.status(200).json({
        status: "success",
        result: topics.length,
        data: topics
    });

});


exports.addOne = catchAsync(async (req, res, next) => {


    const found = await mainModel.findAll({ where: { owner: req.user._id } });
    const data = found.map(one => one.dataValues);
    let current = null;


    // Get Current database 
    data.forEach(elm => {
        if (elm._id === req.body.database) {
            current = elm
        }
    })

    if (!current) {
        return next(new AppError('Database cannot be found, please try again with valid database.', 500));
    }


    // Get Current space

    process.env.DB_TENANT_NAME = current.db_name;
    process.env.DB_TENANT_PASSWORD = current.db_name;

    await progresqlConection();
    const topicsModel = await connectModel();
    const spacesModel = await connectModelSpace();

    // Get Data
    const foundSpaces = await spacesModel.findAll();
    const spaces = foundSpaces.map(one => one.dataValues);

    let currentSpace = null;

    // Get Current database 
    spaces.forEach(elm => {
        if (elm._id === req.body.space) {
            currentSpace = elm;
        }
    })

    if (!currentSpace) {
        return next(new AppError('Space cannot be found, please try again with valid space.', 500));
    }

    // Add Topic


    req.body.owner = req.user._id;
    const topic = await topicsModel.create(req.body);


    res.status(200).json({
        status: "success",
        data: topic
    });


});
