const { DataTypes } = require('sequelize');
const connect = require('../../Tenant/sequelize');

const mainUsersModel = require('../mainUsersModel');
const generateUniqueId = require('generate-unique-id');

const connectModel = () => {

    const sequelize = connect();

    const spacesModel = sequelize.define('spaces', {
        _id: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false
        },
        desc: {
            type: DataTypes.STRING,
        },
        private: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        type: {
            type: DataTypes.STRING,
            defaultValue: 'Company'
        },
        discussion: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        metting: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        support: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        database: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        owner: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'spaces', // We need to choose the model name
    });

    spacesModel.addHook('beforeValidate', async (elm) => {
        elm._id = await generateUniqueId({
            length: 32
        });
    });


    spacesModel.addHook('afterFind', async (elms) => {

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
        }
    });

    return spacesModel;
}


module.exports = connectModel;