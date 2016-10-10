'use strict';

var assert = require('assert');
var OfxExtractor = require('../lib/OfxExtractor');

describe('OfxExtractor', function () {
  var ofxFilename = 'test/samples/sample-one-account.ofx';
  var extractor = new OfxExtractor(ofxFilename);
  describe(ofxFilename + ' file', function () {

    it('should return 3 transactions', function () {
      return extractor.run()
        .then(function (data) {
          assert.equal(data.trx.length, 3);
        });
    });

    it('account number should be 1234567890', function () {
      return extractor.run()
        .then(function (data) {
          assert.equal(data.account, 1234567890);
        });
    });
  });
});