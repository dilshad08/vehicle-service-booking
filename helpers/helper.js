const { isNull, isUndefined } = require("lodash");
const createError = require("http-errors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const isDef = (param) => {
  if (isNull(param) || isUndefined(param)) {
    return false;
  } else {
    return true;
  }
};

const signAccessToken = (username, firstname) => {
  try {
    const payload = { username,  firstname};
    const secret = process.env.SECRET;
    const options = {
      expiresIn: "88h"
    };
    const token = jwt.sign(payload, secret, options);
    if (!isDef(token)) {
      throw createError.BadRequest("Token Error");
    }
    return token;
  } catch (error) {
    throw error;
  }
};


const cryptPassword = (password) =>
bcrypt.genSalt(10)
.then((salt => bcrypt.hash(password, salt)))
.then(hash => hash);

const comparePassword = async (password, hashPassword) => {
    try {
      const result = await bcrypt.compare(password, hashPassword);
      return result;
    } catch (error) {
      console.log(error);
    }
}

const httpResp = (result, message, data, jwt) => {
  const response = {
    result: result,
  };
  if (isDef(jwt)) {
    response.jwt = jwt;
  }
  if (isDef(message)) {
    response.message = message;
  }
  if (isDef(data)) {
    response.data = data;
  }
  return response;
};

const successHandler = (res, message, data, jwt) => {
 
  const resp = httpResp(true, message, data, jwt);
  
  return res.status(200).send(resp);
};

const verifyToken = async function (req, res, next) {

  const tkn = req.headers.authorization;

  if (isDef(tkn)) {
    const token = tkn.split(' ')[1];
    try {
      // verifies secret and checks exp
      let decoded = jwt.verify(token, process.env.SECRET);
      // if everything is good, save to request for use in other routes
      req.decoded = decoded;
      if (decoded) {
        return next();
      } else {
        throw createError(401, 'JWT Verification Failed');
      }
    } catch (error) {
      if (error.name == "JsonWebTokenError" || "TokenExpiredError"){
        error.status = 401;
        error.message = 'JWT Verification Failed';
      }
      return next(error);
    }
  } else {
    return next(createError(401,'Please provide a JWT token'));
  }
  
}

const deepCopy =function (arr) {
  return JSON.parse(JSON.stringify(arr))
}

module.exports = {
  isDef,
  signAccessToken,
  cryptPassword,
  comparePassword,
  successHandler,
  verifyToken,
  deepCopy
};
