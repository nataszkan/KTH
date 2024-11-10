'use strict'

/**
 * Sample API model. Can safely be removed.
 */

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: [true, 'First name is required.'],
    trim: true,
    minlength: [1, 'First name must have at least one character.'],
    maxlength: [20, 'First name must have at most 20 characters.'],
    default: '',
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required.'],
    trim: true,
    minlength: [1, 'Last name must have at least one character.'],
    maxlength: [20, 'Last name must have at most 20 characters.'],
    default: '',
  },
})

module.exports = mongoose.model('Sample', schema)
