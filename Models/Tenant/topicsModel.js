const { DataTypes } = require('sequelize');
const connect = require('../../Tenant/sequelize');

const mainUsersModel = require('../mainUsersModel');
const connectModelSpace = require('./spacesModel');
const generateUniqueId = require('generate-unique-id');


const connectModel = () => {

    const sequelize = connect();
    const spacesModel = connectModelSpace();


    const topicsModel = sequelize.define('topics', {
        _id: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        desc: {
            type: DataTypes.STRING,
        },
        private: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        space: {
            type: DataTypes.STRING,
            allowNull: false,
            // references: {
            //     model: spacesModel,
            //     key: '_id',
            // }
        },
        type: {
            type: DataTypes.STRING,
        },
        owner: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'topics', // We need to choose the model name
    });


    topicsModel.addHook('beforeValidate', async (elm) => {
        elm._id = await generateUniqueId({
            length: 32
        });
    });


    topicsModel.addHook('afterFind', async (elms) => {

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


    topicsModel.addHook('afterFind', async (elms) => {

        const data = await spacesModel.findAll();

        if (data && Array.isArray(data)) {
            const allUsers = data.map(one => one.dataValues);

            if (!Array.isArray(elms)) {
                elms = [elms];
            }

            elms.forEach(child => {
                if (child) {
                    child.dataValues.id = undefined;
                    child.dataValues.space = allUsers.filter(one => one._id === child.dataValues.owner).map(x => x)[0];
                }
            });
        }
    });

    return topicsModel;



}


module.exports = connectModel;