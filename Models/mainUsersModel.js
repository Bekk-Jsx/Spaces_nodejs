const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const bcrypt = require("bcryptjs");
const generateUniqueId = require('generate-unique-id');

const mainUsersModel = sequelize.define('main_users', {
    _id: {
        type: DataTypes.STRING,
        unique: true
    },
    username: {
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
}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'main_users', // We need to choose the model name
});


mainUsersModel.addHook('beforeValidate', async (user) => {
    user.password = await bcrypt.hash(user.password, 12);
    user._id = await generateUniqueId({
        length: 32
    });
});


mainUsersModel.addHook('afterFind', async (data) => {

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



module.exports = mainUsersModel;