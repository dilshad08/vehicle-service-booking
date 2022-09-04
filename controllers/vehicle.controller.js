const createError = require('http-errors');
const { successHandler, deepCopy, isDef } = require('../helpers/helper');
const { Booking } = require('../models/booking');
const { Timeslot } = require('../models/timeslot');
const { Vehicle } = require('../models/vehicle');
const {
  isEmpty,
} = require('lodash');
const {Op} = require('sequelize');


module.exports = {

  // User registration controller
  getSlots: async (req, res, next) => {
    try {
      const {vehicleId, date} = req.query;
      let slots = await Booking.findAll({
        where: {
          // vehicle_id: vehicleId,
          date: new Date(date),
        },
        include: [{
          model: Timeslot,
          attributes: ['id']
        }],
        include: [{
          model: Vehicle,
          attributes: ['id', 'name', 'model']
        }],
      })
      slots = deepCopy(slots)

      const mapObj = {};
      slots.forEach((obj) => {
        mapObj[obj.vehicle_id] = {
          vehicle: obj.Vehicle,
          timeslotArr: []
        }
      })
      slots.forEach((obj) => {
        mapObj[obj.vehicle_id]['timeslotArr'].push(obj.timeslot_id)
      })

      const promiseArr = [];
      for (let key of Object.keys(mapObj)) {

        const promise = (async () => {
          let booking = await Timeslot.findAll({
            where: {
              id: {[Op.not]: mapObj[key].timeslotArr}
            },
            attributes: ['from', 'to'],
          })
          booking.vehicle = mapObj[key].vehicle
          booking.key = key
          return booking
        })();
        promiseArr.push(promise)
      }
      let result = await Promise.all(promiseArr);

      result.map((obj) => {

        mapObj[obj.key] = {vehicle: obj.vehicle,timeslotArr: [] }

        obj.map((innerObj) => {
          mapObj[obj.key].timeslotArr.push(innerObj.dataValues)
          console.log();
        })
        return mapObj
      })
      const responseArray = Object.values(mapObj)
      successHandler(res, null,responseArray );

    } catch (error) {
      next(error)
    }
  },

  // User Login Controller
  bookSlot: async (req, res, next) => {
    try{
      const { vehicleId, from, to, date } = req.body.bookSlot;
      let isAvailable = await Timeslot.findAll({
        where: {
          from,to
        },
        include: Vehicle
      })
      isAvailable = deepCopy(isAvailable)

      const VehicleTimeslotArr = isAvailable[0].Vehicles.filter((obj)=>{
        return obj.VehicleTimeslot.vehicle_id == vehicleId
      });

      if(isEmpty(isAvailable)){
        throw createError.Unauthorized('No time slots available')
      }
      let isBoooked = await Booking.findOne({
        where: {
          timeslot_id: isAvailable[0].id,
          vehicle_id: vehicleId,
        }
      });

      let reqDate = new Date(date);
      let dbDate = new Date();
      isBoooked = deepCopy(isBoooked);
      if(isDef(isBoooked)){
        dbDate = new Date(isBoooked.date)
      }

      if(!isDef(isBoooked) && !isEmpty(VehicleTimeslotArr)){
        const booking = await Booking.create({
          vehicle_id: vehicleId,
          timeslot_id: isAvailable[0].id,
          date: new Date(date)
        })
      }
      else if(reqDate > dbDate && !isEmpty(VehicleTimeslotArr)){
        const booking = await Booking.create({
          vehicle_id: vehicleId,
          timeslot_id: isAvailable[0].id,
          date: new Date(date)
        }) 
      }else{
        throw createError.Unauthorized('Slot already booked or slot is not available')
      }

      successHandler(res, 'Booked')
    }

    catch (error) {
      next(error)
    }
  },


};
