const { Sequelize } = require('sequelize');
// const sequelize = new Sequelize('postgres://root:sd2018@localhost:3306/sequelize');

const sequelize = new Sequelize('spaces', 'postgres', 'Zeuspostgres', {
    host: 'localhost',
    dialect: 'postgres'
});


module.exports = sequelize;