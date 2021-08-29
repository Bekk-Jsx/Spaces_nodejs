const { Sequelize } = require('sequelize');
// const sequelize = new Sequelize('postgres://root:sd2018@localhost:3306/sequelize');

const connect = () => {

    const sequelize = new Sequelize(process.env.DB_TENANT_NAME, 'postgres', process.env.DB_TENANT_PASSWORD, {
        host: 'localhost',
        dialect: 'postgres'
    });

    return sequelize;

}



module.exports = connect;