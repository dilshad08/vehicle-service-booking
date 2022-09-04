const { sequelize, Sequelize } = require('../database/db_con')
const { Booking } = require('./booking')
const { Timeslot } = require('./timeslot')
const { VehicleTimeslot } = require('./timeslot_vehicle_map')
const Vehicle = sequelize.define('Vehicle', {

    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },

    name: {
        type: Sequelize.STRING
    },

    model: {
        type: Sequelize.STRING
    }

}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'vehicles'
})


Vehicle.belongsToMany(Timeslot, {
    through: VehicleTimeslot,
    foreignKey: 'vehicle_id'
})
Timeslot.belongsToMany(Vehicle, {
    through: VehicleTimeslot,
    foreignKey: 'timeslot_id'
})

module.exports = {
    Vehicle,
}