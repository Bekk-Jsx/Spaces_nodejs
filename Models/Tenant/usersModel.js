const { DataTypes } = require('sequelize');
const connect = require('../../Tenant/sequelize');

const mainUsersModel = require('../mainUsersModel');
const connectModelSpace = require('./spacesModel');
const generateUniqueId = require('generate-unique-id');
const bcrypt = require("bcryptjs");

const connectModel = () => {

    const sequelize = connect();

    const usersModel = sequelize.define('users', {

        _id: {
            type: DataTypes.STRING,
            unique: true
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        world: {
            type: DataTypes.STRING,
            allowNull: false
        },
        spaces: {
            type: DataTypes.ARRAY(DataTypes.JSON),
        },
        topics: {
            type: DataTypes.ARRAY(DataTypes.JSON),
        }

    }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'users', // We need to choose the model name
    });



    usersModel.addHook('beforeValidate', async (user) => {
        user.password = await bcrypt.hash(user.password, 12);
        user._id = await generateUniqueId({
            length: 32
        });
    });


    usersModel.addHook('afterFind', async (data) => {

        if (data && data.dataValues) {
            data.dataValues.id = undefined
        } else if (data && Array.isArray(data)) {
            data.forEach(child => {
                if (child) {
                    child.dataValues.id = undefined;
                }
            });
        }

    });

    return usersModel;

}

module.exports = connectModel;