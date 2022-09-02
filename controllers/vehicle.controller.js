const createError = require('http-errors');
const { successHandler } = require('../helpers/helper');
const {
  isEmpty,
  size,
} = require('lodash');


module.exports = {

  // User registration controller
  getSlots: async (req, res, next) => {
    try {

      successHandler(res, 'SignUp success. Please proceed to Signin', null, null);

    } catch (error) {
      next(error)
    }
  },


  // User Login Controller
  bookSlot: async (req, res, next) => {


    try{

      successHandler(res, 'Signin success', null, accessToken)
    }

    catch (error) {
      next(error)
    }
  },

};
