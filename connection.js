const sequelize = require('./sequelize');
const Model = require('./Models/mainModel');

const postgresql = async () => {
    try {
        await sequelize.authenticate();
        // await sequelize.sync({ force: true });
        // await Model.sync({ force: true });
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}



module.exports = postgresql;