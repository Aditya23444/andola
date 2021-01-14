const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
//Define a schema
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    maxlength: 32,
    minlength: 1,
    // required:[true, 'first name is required!'],
    validate: {
      validator: function(v) {
        return /^([a-zA-Z0-9]+[,.]?[ ]?|[a-zA-Z0-9]+['-]?)+$/.test(v);
      },
      message: props => `${props.value} is not a valid name!`
    }
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    sparse: true,
    index: true,
    // required: [true, 'email is required'],
    validate: {
      validator: function(v) {
        /* eslint-disable no-useless-escape */
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    },
  },
  password: {
    type: String,
    trim: true,
    required: true
  },
  gender: {
    type: String,
    trim: true,
    required: true
  },
  contact: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    index: true,
    // required:[true, 'phone number is required!'],
    validate: {
      validator: function(v) {
        return /^[0][1-9]\d{9}$|^[1-9]\d{9}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  createdAt: {
    type: Date,
    default: new Date(),
    required: true
  }

});
// hash user password before saving into database
UserSchema.pre('save', function(next){
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});
module.exports = mongoose.model('User', UserSchema);
