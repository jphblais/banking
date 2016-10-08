'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var Banking = require('banking');
var traverse = require('traverse');

Promise.promisifyAll(Banking);

class OfxExtractor {
  constructor (filename) {
    this.filename = filename;
    this.data = null;
  }

  parseFile (filename) {
    return new Promise(function (resolve, reject) {
      try {
        Banking.parseFile(filename, function (res) {
          resolve(res.body);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  extractData (obj) {
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

  run () {
    return this.parseFile(this.filename)
      .then(this.extractData);
  }
}

module.exports = OfxExtractor;