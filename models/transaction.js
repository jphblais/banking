'use strict';

var Schema = require('mongoose').Schema;

var transactionSchema = new Schema({
  account: Number,
  transactionId: Number,
  transactionType: { type: String, lowercase: true, trim: true },
  date: Date,
  amount: Number,
  description: { type: String, lowercase: true, trim: true }
});

transactionSchema.index({ account: 1, transactionId: 1 }, { unique: true });

module.exports = function (mongoose) {
  return mongoose.model('Transaction', transactionSchema);
};