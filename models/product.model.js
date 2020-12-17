// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');

const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize) => {
  const users = sequelize.define("users", {
   name: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.INTEGER
    }

  });

  return users;
};
