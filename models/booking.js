const { sequelize, Sequelize } = require('../database/db_con')
const { Timeslot } = require('./timeslot')
const { Vehicle } = require('./vehicle')
const Booking = sequelize.define('Booking', {

    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },

    date: {
      type: Sequelize.DATEONLY,
    //   defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },

    vehicle_id: {
        type: Sequelize.INTEGER
    },

    timeslot_id: {
        type: Sequelize.INTEGER
    }

}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'bookings'
})

Booking.belongsTo(Timeslot, {foreign_key: 'timeslot_id'} )
Booking.belongsTo(Vehicle, {foreign_key: 'vehicle_id'} )


module.exports = {
    Booking,
}