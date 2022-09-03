const { sequelize, Sequelize } = require('../database/db_con')
const Timeslot = sequelize.define('Timeslot', {

    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },

    weekday: {
        type: Sequelize.STRING
    },

    from: {
      type: Sequelize.INTEGER
    },

    to: {
      type: Sequelize.INTEGER
    },

}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'timeslots'
})


module.exports = {
    Timeslot,
}