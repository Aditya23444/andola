const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  image: {
    type: String,
    trim: true,
  },
  price:{
    type: Number,
    trim: true,
    required: true
  }


});
// hash user password before saving into database

module.exports = mongoose.model('Product', ProductSchema);
