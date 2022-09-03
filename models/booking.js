const { sequelize, Sequelize } = require('../database/db_con')
const { Timeslot } = require('./timeslot')
const Booking = sequelize.define('Booking', {

    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },

    status: {
        type: Sequelize.BOOLEAN,
        default: false
    },

    created_at: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },

    updated_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }

}, {
    createdAt: 'created_at',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'bookings'
})

Booking.belongsTo(Timeslot, {foreign_key: 'timeslot_id'} )


module.exports = {
    Booking,
}