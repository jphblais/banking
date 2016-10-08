'use strict';

var _ = require('lodash');

/*******************************************************
 * processOfxData
 * return an array of promises to save the transactions.
 */
function bulkSave (data, model, stats) {
  return _.map(data, function (document) {
    var obj = new model(document);
    return obj.save()
      .then(function () {
        stats.created++;
      }).catch(function (err) {
        if (err.code === 11000) {
          stats.duplicates++;
        } else {
          return this.reject(err);
        }
      });
  });
}

module.exports = bulkSave;