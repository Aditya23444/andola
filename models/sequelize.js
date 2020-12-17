const dbConfig = require("../config/dbConfig");

const Sequelize = require("sequelize");
const sequelize = new Sequelize('mysql://root:12345678@localhost:3306/test', {
  dialect: 'mysql',
  logging: false,
  define: {
    freezeTableName: true,

  }
});

const db = {};

db.Sequelize = Sequelize;

db.tutorials = require("./users.model.js")(sequelize, Sequelize);

module.exports = db;
