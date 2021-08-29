const catchAsync = require('./../../utils/catchAsync');
const AppError = require('./../../utils/appError');
const mainModel = require('../../Models/mainModel');

const progresqlConection = require('../../Tenant/connection');

exports.getAll = (connectModel, params) => catchAsync(async (req, res, next) => {


    const found = await mainModel.findOne({ where: { _id: req.query.database, owner: req.user._id } });
    const current = found && found.dataValues ? found.dataValues : null;

    if (!current) {
        return next(new AppError('Database cannot be found, please try again with valid database.', 500));
    }


    // Connect Current space

    process.env.DB_TENANT_NAME = current.db_name;
    process.env.DB_TENANT_PASSWORD = current.db_name;

    await progresqlConection();


    if (params.checkType && !params.types.includes(req.query.type)) {
        return next(new AppError('Type of search cannot be found, please try again with valid type.', 500));
    }


    const Model = await connectModel();
    const docs = await Model.findAll({ where: { type: req.query.type, space: req.query.space, topic: req.query.type === 'topic' ? req.query.topic : null } });
    const data = docs.map(one => one.dataValues);



    res.status(200).json({
        status: "success",
        result: data.length,
        data
    });

});

exports.addOne = (connectModel, params) => catchAsync(async (req, res, next) => {


    const found = await mainModel.findOne({ where: { _id: req.body.database, owner: req.user._id } });
    const current = found && found.dataValues ? found.dataValues : null;

    if (!current) {
        return next(new AppError('Database cannot be found, please try again with valid database.', 500));
    }


    // Connect Current space

    process.env.DB_TENANT_NAME = current.db_name;
    process.env.DB_TENANT_PASSWORD = current.db_name;

    await progresqlConection();


    if (params.checkSpace) {

        const spacesModel = await params.connectModelSpaces();
        const current = await spacesModel.findOne({ where: { _id: req.body.space } });

        if (!current || !current.dataValues) {
            return next(new AppError('Space cannot be found, please try again with valid space.', 500));
        }

    }


    if (params.checkSpace && req.body.type === "topic") {

        const topicsModel = await params.connectModeltopics();
        const current = await topicsModel.findOne({ where: { _id: req.body.topic, space: req.body.space } });

        if (!current || !current.dataValues) {
            return next(new AppError('Topic cannot be found, please try again with valid topic.', 500));
        }

    } else if (req.body.type === "space") {
        req.body.topic = undefined;
    }



    req.body.owner = req.user._id;
    const Model = await connectModel();
    const docs = await Model.create(req.body);


    res.status(201).json({
        status: "success",
        data: docs
    });

});