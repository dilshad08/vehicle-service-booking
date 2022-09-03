const { sequelize, Sequelize } = require('../database/db_con')
const { Booking } = require('./booking')
const { Timeslot } = require('./timeslot')
const VehicleTimeslot = sequelize.define('VehicleTimeslot', {

    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },

}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'vehicle_timeslot_map'
})

module.exports = {
  VehicleTimeslot,
}