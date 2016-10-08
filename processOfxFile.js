'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var assert = require('assert');
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
  { name: 'files', type: String, multiple: true, defaultOption: true }
];

const options = commandLineArgs(optionDefinitions);

var ofxFilename = null;

if (!options.files) {
  console.error('Please provide --files option');
  return 1;
} else {
  ofxFilename = options.files[0];
}

var OfxExtractor = require('./lib/OfxExtractor');
var normalize = require('./lib/NormaliserService');
var bulkSave = require('./lib/BulkPersistService');

var models = require('./models');

var stats = {
  created: 0,
  duplicates: 0
};

var extractor = new OfxExtractor(ofxFilename);
extractor.run()
  .then(normalize)
  .then(function (data) {
    return bulkSave(data, models.Transaction, stats)
  })
  .then(Promise.all)
  .then(function() {
     console.log('all saved');
     console.log('nbNew = ' + stats.created);
     console.log('nbDuplicates = ' + stats.duplicates);
   })
  .then(function () {
     models.mongoose.connection.close();
   });

