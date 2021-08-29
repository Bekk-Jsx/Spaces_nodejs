const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const mainUsersModel = require('./mainUsersModel');
const generateUniqueId = require('generate-unique-id');


const mainModel = sequelize.define('main', {
    _id: {
        type: DataTypes.STRING,
    },
    db_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    db_username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    db_password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    owner: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: mainUsersModel,
            key: '_id',
        }
    },
}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'main', // We need to choose the model name
});


mainModel.addHook('beforeValidate', async (user) => {
    user._id = await generateUniqueId({
        length: 32
    });
});


mainModel.addHook('afterFind', async (elms) => {

    const data = await mainUsersModel.findAll();

    if (data && Array.isArray(data)) {
        const allUsers = data.map(one => one.dataValues);

        if (!Array.isArray(elms)) {
            elms = [elms];
        }

        elms.forEach(child => {
            if (child) {
                child.dataValues.id = undefined;
                child.dataValues.owner = allUsers.filter(one => one._id === child.dataValues.owner).map(x => x)[0];
            }
        });
    } else {

    }
});


module.exports = mainModel;