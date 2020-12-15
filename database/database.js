const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas', 'root', 'Bj1011*KILER', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;