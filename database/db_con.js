const Sequelize = require('sequelize');
const db = require('../config/db');
var dialectOptions = { }

let dbHost = db.host
let dbUsername = db.user
let dbPassword = db.password
let dbDatabase = db.database

const sequelize = new Sequelize(dbDatabase, dbUsername, dbPassword, {
  host: dbHost,
  dialect: 'mysql',
  dialectOptions: dialectOptions,
  logging: process.env.DB_LOGGING === "true" ? console.log : false,
  pool: {
    max: 1,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})


sequelize.authenticate().then( () => {
  console.log('Connection has been established successfully.');
  

  sequelize.sync({force:false})
      .then(() => {
          console.log(`Database & tables created!`);
      }).catch((error)=>{
          return console.error(error);
      });

}).catch((error) => {
  console.error('Unable to connect to the database:', error);
})



module.exports = {
  sequelize,
  Sequelize
}