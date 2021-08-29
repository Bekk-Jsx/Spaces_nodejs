const { DataTypes } = require('sequelize');
const connect = require('../../Tenant/sequelize');

const mainUsersModel = require('../mainUsersModel');
const connectModelSpace = require('./spacesModel');
const generateUniqueId = require('generate-unique-id');


const connectModel = () => {

    const sequelize = connect();

    const inviteModel = sequelize.define('invite', {
        _id: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        type: {
            type: DataTypes.STRING,
            defaultValue: "spaces"
        },
        permission: {
            type: DataTypes.STRING,
            defaultValue: "commentor"
        },
        space: {
            type: DataTypes.STRING,
            allowNull: false,
            // references: {
            //     model: spacesModel,
            //     key: '_id',
            // }
        },
        owner: {
            type: DataTypes.STRING,
            allowNull: false,
            // references: {
            //     model: spacesModel,
            //     key: '_id',
            // }
        },
        topic: {
            type: DataTypes.STRING,
            // references: {
            //     model: spacesModel,
            //     key: '_id',
            // }
        },
        start: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end: {
            type: DataTypes.DATE,
            allowNull: false,
        },

    }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'invite', // We need to choose the model name
    });


    inviteModel.addHook('beforeValidate', async (elm) => {
        elm._id = await generateUniqueId({
            length: 32
        });
    });

    return inviteModel;

}

module.exports = connectModel;