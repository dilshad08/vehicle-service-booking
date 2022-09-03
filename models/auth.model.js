const { sequelize, Sequelize } = require('../database/db_con')
var User = sequelize.define('User', {

    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },

    firsr_name: {
        type: Sequelize.STRING
    },
    
    last_name: {
        type: Sequelize.STRING
    },

}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'users'
})


module.exports = {
    User,
}