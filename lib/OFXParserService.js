'use strict';

var Promise = require('bluebird');
var Banking = require('banking');
var traverse = require('traverse');

Promise.promisifyAll(Banking);

function parseOfxFile (ofxFilename) {
  return new Promise(function (resolve, reject) {
    try {
      Banking.parseFile(ofxFilename, function (res) {
        resolve(res.body);
      });
    } catch (err) {
      reject(err);
    }
  });
}

function extractData (obj) {
  var data = {
    trx: null,
    account: null
  };
  traverse(obj).map(function (x) {
    if (this !== undefined) {
      switch (this.key) {
        case 'STMTTRN':
          data.trx = x;
          break;
        case 'ACCTID':
          data.account = x;
          break;
      }
    }
  });
  return data;
}

function parse (ofxFilename) {
  return parseOfxFile(ofxFilename)
    .then(extractData)
    .catch(function (err) {
      console.log('Oupsie!  An error occurred.');
      console.log(err);
    });
}

module.exports = {
  parse: parse
};