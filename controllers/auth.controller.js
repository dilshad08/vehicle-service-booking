const createError = require('http-errors');
const { successHandler } = require('../helpers/helper');
const {
  isEmpty,
  size,
} = require('lodash');

module.exports = {

  // User registration controller
  userSignUp: async (req, res, next) => {
    try {

      successHandler(res, 'SignUp success. Please proceed to Signin', null, null);

    } catch (error) {
      next(error)
    }
  },


  // User Login Controller
  userSignIn: async (req, res, next) => {


    try{

      successHandler(res, 'Signin success', null, accessToken)
    }

    catch (error) {
      next(error)
    }
  },

};
