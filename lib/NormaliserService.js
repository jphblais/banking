'use strict';

var _ = require('lodash');

function ofxDate2isoDate (str) {
  // 20160802020000[-5:EST]
  // YYYYMMDDHHMMSS
  var datePattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\[(.*?):(.*?)\]/;
  var date = str.replace(datePattern, '$1-$2-$3T$4:$5:$6');
  return new Date(date);
}

function transactions (data) {
  return _.map(data.trx, function (row) {
    return {
      transactionType: row.TRNTYPE,
      date: ofxDate2isoDate(row.DTPOSTED),
      amount: row.TRNAMT,
      transactionId: row.FITID,
      description: row.NAME,
      account: data.account
    };
  });
}

module.exports = {
  transactions: transactions,
  ofxDate2isoDate: ofxDate2isoDate
};