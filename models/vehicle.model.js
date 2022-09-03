const { sequelize, Sequelize } = require('../database/db_con')
var Vehicle = sequelize.define('Vehicle', {

    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },

    name: {
        type: Sequelize.STRING
    },

}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'vehicles'
})


module.exports = {
    Vehicle,
}