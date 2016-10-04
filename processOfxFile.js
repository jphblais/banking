'use strict';

console.log(process.argv);

var _ = require('lodash');
var Promise = require('bluebird');
var MongoDB = require('mongodb');
var assert = require('assert');
var inspect = require('util').inspect;
var argv = require('argv');
var ofxParserService = require('./lib/OFXParserService');

var args = argv.option(
  [ {
    name: 'file',
    short: 'f',
    type: 'path'
  } ]).run();

var ofxFilename = null;
if (!args.options.file) {
  console.error('Please provide --file option');
  return 1;
} else {
  ofxFilename = args.options.file;
  console.log(ofxFilename);
}

Promise.promisifyAll(MongoDB);

// Connection URL
var url = 'mongodb://localhost:27017/banking';

function mapper(row) {
  return {
    transactionType: row.TRNTYPE,
    date: row.DTPOSTED,
    amount: row.TRNAMT,
    transactionId: row.FITID,
    description: row.NAME
  };
}

function processData (data) {
  MongoDB.MongoClient.connect(url)
    .then(function (mongoClient) {
      console.log('Connected correctly to server');

      // console.log(inspect(data, { colors: false, depth: Infinity }));

      var transactions = mongoClient.collection('transactions');
      _.forEach(data.trx, function (row) {
        var doc = mapper(row);
        doc.account = data.account;
        console.log(doc);
        transactions.insertOne(doc, null, function(err, result) {
          assert.equal(err, null);
          assert.equal(1, result.result.n);
          assert.equal(1, result.ops.length);
          console.log("Inserted document into the collection");
        });
      });

      mongoClient.close();
    })
    .catch(function (err) {
      console.log('Oupsie!  An error occurred.');
      console.log(err);
    });
}

ofxParserService.parse(ofxFilename)
  .then(processData);
