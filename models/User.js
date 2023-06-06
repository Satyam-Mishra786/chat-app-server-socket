const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide Username']
  },
  email: {
    type: String,
    unique:[true, 'This email already exist'],
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 8,
  }
}, { timestamps: true })

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, email: this.email, username: this.email },
    process.env.JWT_SECRET,
    { expiresIn: '30d' })
}


module.exports = mongoose.model('User', UserSchema)