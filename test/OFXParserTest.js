'use strict';

var assert = require('assert');
var ofxParserService = require('../lib/OFXParserService');

describe('ofxParserService', function () {
  var ofxFilename = 'test/samples/sample-one-account.ofx';
  describe(ofxFilename + ' file', function () {

    it('should return 3 transactions', function () {
      return ofxParserService.parse(ofxFilename)
        .then(function (data) {
          assert.equal(data.trx.length, 3);
        });
    });

    it('account number should be 1234567890', function () {
      return ofxParserService.parse(ofxFilename)
        .then(function (data) {
          assert.equal(data.account, 1234567890);
        });
    });
  });
});