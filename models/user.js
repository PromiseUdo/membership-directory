const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new mongoose.Schema({
  avatarUrl: {
    type: String,
  },
  username: {
    type: String,
  },
  firstname: {
    type: String,
  },
  role: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  uniqueID: {
    type: String,
  },
  country: {
    type: String,
  },
  phone: {
    type: String,
  },
  state: {
    type: String,
  },
  lga: {
    type: String,
  },
})

module.exports = mongoose.model('User', userSchema)
