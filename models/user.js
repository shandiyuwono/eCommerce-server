const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { hashPassword } = require('../helpers/bcrypt')

let uniqueCheck = function(value) {
  return User.findOne({
    email: value
  })
    .then(user => {
      if (user) {
        return false
      }
    })
}

let formatCheck = function(value) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(value);
}

const UserSchema = new Schema({
  firstName : {
    type: String,
    required: [true, 'first name is required']
  },
  lastName : {
    type: String,
    required: [true, 'last name is required']
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    validate: [
      { validator: uniqueCheck, msg: 'Email is already registered' },
      { validator: formatCheck, msg: 'Incorrect email format'}
    ],
  },
  password: {
  type: String,
  required: [true, 'password is required'],
  minlength: 8,
  maxlength: 12
  }
})

UserSchema.pre('save', function (next) {
  let hash = hashPassword(this.password)
  this.password = hash
  next()
})

  
const User = mongoose.model('User', UserSchema)

module.exports = User