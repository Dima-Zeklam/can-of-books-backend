'use strict';
const mongoose = require('mongoose');
const BookSchema = require('./Schema')//Schema



  const bookModel = mongoose.model('books', BookSchema);

  module.exports = bookModel;