const connect = require('./sequelize');
const spacesModel = require('../Models/Tenant/spacesModel');
const topicsModel = require('../Models/Tenant/topicsModel');
const inviteModel = require('../Models/Tenant/inviteModel');
const usersModel = require('../Models/Tenant/usersModel');

const postgresql = async () => {
    try {

        let sequelize = connect();
        await sequelize.authenticate();

        const Model = await spacesModel();
        const Model1 = await topicsModel();
        const Model2 = await inviteModel();
        const Model3 = await usersModel();


        // await sequelize.sync({ force: true });
        // await Model.sync({ force: true });
        // await Model1.sync({ force: true });
        // await Model2.sync({ force: true });
        // await Model3.sync({ force: true });

        console.log('Tenant Connection has been established successfully.');



        // return sequelize;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}



module.exports = postgresql;