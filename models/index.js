'use strict';

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//Lets connect to our database using the DB server URL.
mongoose.connect('mongodb://localhost/banking');

module.exports = {
  mongoose: mongoose,
  Transaction: require('./transaction')(mongoose)
};