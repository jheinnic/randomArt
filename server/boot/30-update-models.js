(function () {
  'use strict';

  module.exports = function (app) {
    var _ = require('lodash');
    var vsprintf = require('sprintf-js').vsprintf;
    var modelCfg = require('../model-config');
    var modelNames = _.without(Object.keys(modelCfg), '_meta');
    var db = app.dataSources.db;

    // TODO: Determine if console.error() should or should not repeat throw new Error().
    // TODO: Find a way to test logging levels before calling toString().
    db.isActual(
      modelNames,
      function onActualIsKnown(err, result) {
        if (err) {
          var msg = vsprintf(
            'Failed to discover whether or not %s are up to date.  Bootstrap is aborting: %s',
            [modelNames.toString(), err.toString()]
          );
          console.error(msg);
          throw new Error(msg);
        } else if (result) {
          console.info(
            // vsprintf('Models in %s are all up to date.  No special action was required', [modelNames.toString()])
            'Models in %s are all up to date.  No special action was required', modelNames.toString()
          );
        } else {
          db.autoupgrade(
            modelNames,
            function onAutoUpdate(err, result) {
              // if (err && err.code !== '42P07') {
              if (err) {
                var msg = vsprintf(
                  'Failed to autoupgrade %s after determining at least one was out of date.  Bootstrap is aborting: %s',
                  [modelNames.toString(), err.stack.toString()]
                );
                console.error(msg);
                throw new Error(msg);
              } else if (result) {
                console.info(
                  // vsprintf('Successfully autoupgraded %s: %s', [modelNames.toString(), result.toString()])
                  'Successfully autoupgraded %s: %s', modelNames.toString(), result.toString()
                );
              } else {
                console.info(
                  // vsprintf('Successfully autoupgraded %s', [modelNames.toString()])
                  'Successfully autoupgraded %s', modelNames.toString()
                );
              }
            }
          );
        }
      }
    );
  };
}).call();

