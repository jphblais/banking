'use strict';

var assert = require('assert');
var normalise = require('../lib/NormaliserService');

describe('NormaliserService', function () {
  describe('Successful date normalisations', function () {
    var dateStr = '20160802020000[-5:EST]';
    var date = normalise.ofxDate2isoDate(dateStr);
    it('Return an object', function () {
      assert.equal(typeof date === 'object', true);
    });
    it('match the expected date', function () {
      var expectedDate = new Date('2016-08-02T02:00:00');
      assert.equal(date.getTime() === expectedDate.getTime(), true);
    });
    it('match the iso date', function () {
      var isoDate = new Date('Mon Aug 01 2016 22:00:00 GMT-0400 (EDT)');
      assert.equal(date.getTime() === isoDate.getTime(), true);
    });
  });
  describe('Normalisations with invalid date string', function () {
    var dateStr = 'I\'m an invalid date string';
    var date = normalise.ofxDate2isoDate(dateStr);
    it('Return an object', function () {
      assert.equal(typeof date === 'object', true);
    });
    it('match the invalid date string', function () {
      assert.equal(date == 'Invalid Date', true);
    });
    it('getTime on our invalid date string match NaN', function () {
      console.log(typeof date.getTime());
      assert.equal(isNaN(date.getTime()), true);
    });
  });
});