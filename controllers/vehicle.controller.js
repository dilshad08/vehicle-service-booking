const createError = require('http-errors');
const { successHandler, deepCopy, isDef } = require('../helpers/helper');
const { Booking } = require('../models/booking');
const { Timeslot } = require('../models/timeslot');
const { Vehicle } = require('../models/vehicle');
const {
  isEmpty,
} = require('lodash');
const {Op} = require('sequelize');
const { VehicleTimeslot } = require('../models/timeslot_vehicle_map');
const { validateGetSlotRequest, validateGetSlotsRequest, validateBookSlotsRequest } = require('../helpers/validation');


module.exports = {

  // Get slots by vehicle Id
  getSlotsById: async ( req, res, next) => {

    const {date} = req.query;
      const { vehicleId } = req.params;

    try {
      validateGetSlotRequest({ date, vehicleId})
    } catch (ex) {
      next(createError(401, ex));
    }

    try {
    
      let slots = await Booking.findAll({
        where: {
          vehicle_id: vehicleId,
          date: new Date(date),
        },
        include: [{
          model: Timeslot,
          attributes: ['id']
        }],
      })
   
      slots = deepCopy(slots)

      const timeslotIdArr = slots.map((obj) => {
        return obj.Timeslot.id
      })

      const currenDate = new Date();
      const reqDate = new Date(date);
      let booking = [];

      if((!isEmpty(slots) && reqDate >= currenDate)){

        booking = await Timeslot.findAll({
          where: {
            id: {[Op.not]: timeslotIdArr}
          },
          attributes: ['from', 'to']
        })
      } 
      if((isEmpty(slots) && reqDate > currenDate)){

        booking = await Timeslot.findAll({
          attributes: ['from', 'to']
        })
      }

      booking = deepCopy(booking)
      successHandler(res, null, booking);
      
    } catch (error) {
      next(error)
    }
  },

  // Get slots controller for all vehicles
  getSlots: async (req, res, next) => {
    const {date} = req.query;
    try {
      validateGetSlotsRequest({date})
    } catch (ex) {
      next(createError(401, ex));
    }
    try {

      let slots = await Vehicle.findAll({
        include: [{
          model: Timeslot,
        }],
      })

      slots = deepCopy(slots)

      const mapObj = {};
      const promiseArr = [];
      slots.forEach((obj) => {
        mapObj[obj.id] = {
          vehicle: {id: obj.id, name: obj.name, model: obj.model},
          timeslotArr: []
        }
        obj.Timeslots.map((innerObj) => {

          mapObj[obj.id].timeslotArr.push(innerObj.VehicleTimeslot.timeslot_id)

        })
      })


      slots = await Booking.findAll({
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

      const currenDate = new Date();
      const reqDate = new Date(date);

      
      if(isEmpty(slots) && reqDate > currenDate){
        slots = await Vehicle.findAll({
          include: [{
            model: Timeslot,
          }],
        })

        slots = deepCopy(slots)

        slots.forEach((obj) => {
          mapObj[obj.id] = {
            vehicle: {id: obj.id, name: obj.name, model: obj.model},
            timeslotArr: []
          }
          obj.Timeslots.map((innerObj) => {

            mapObj[obj.id].timeslotArr.push(innerObj.VehicleTimeslot.timeslot_id)

          })
        })

        for (let key of Object.keys(mapObj)) {

          const promise = (async () => {
            let booking = await Timeslot.findAll({
              
              attributes: ['from', 'to'],
            })
            booking.vehicle = mapObj[key].vehicle
            booking.key = key
            return booking
          })();
          promiseArr.push(promise)
        }
      }else{
        slots = deepCopy(slots)
        slots.forEach((obj) => {
          mapObj[obj.vehicle_id] = {
            vehicle: obj.Vehicle,
            timeslotArr: []
          }
        })
        slots.forEach((obj) => {
          mapObj[obj.vehicle_id]['timeslotArr'].push(obj.timeslot_id)
        })

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
      }
      
      let result = await Promise.all(promiseArr);

      result.map((obj) => {

        mapObj[obj.key] = {vehicle: obj.vehicle,timeslots: [] }

        obj.map((innerObj) => {
          mapObj[obj.key].timeslots.push(innerObj.dataValues)
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

  // Book slot controller for a vehicle
  bookSlot: async (req, res, next) => {

    const { vehicleId, from, to, date } = req.body.bookSlot;

    try {
      validateBookSlotsRequest({vehicleId, from, to, date})
    } catch (ex) {
      next(createError(401, ex));
    }

    try{
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
