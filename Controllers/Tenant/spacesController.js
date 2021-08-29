const catchAsync = require('../../utils/catchAsync');
const mainModel = require('../../Models/mainModel');

const progresqlConection = require('../../Tenant/connection');
const connectModel = require('../../Models/Tenant/spacesModel');

const AppError = require('../../utils/AppError');

exports.getAll = catchAsync(async (req, res, next) => {

    const found = await mainModel.findAll({ where: { owner: req.user._id } });
    const data = found.map(one => one.dataValues);

    let all = [];


    for (let i = 0; i < data.length; i++) {
        // Connect data base
        process.env.DB_TENANT_NAME = data[i].db_name;
        process.env.DB_TENANT_PASSWORD = data[i].db_name;

        await progresqlConection();
        const spacesModel = await connectModel();

        // Get Data
        const foundSpaces = await spacesModel.findAll();
        const spaces = foundSpaces.map(one => one.dataValues);


        all = [...all, ...spaces];
    }



    res.status(200).json({
        status: "success",
        result: all.length,
        data: all
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


    // Connect data base
    process.env.DB_TENANT_NAME = current.db_name;
    process.env.DB_TENANT_PASSWORD = current.db_name;

    await progresqlConection();
    const spacesModel = await connectModel();

    // Add Space

    req.body.owner = req.user._id;


    const space = await spacesModel.create(req.body);


    res.status(200).json({
        status: "success",
        data: space
    });

})