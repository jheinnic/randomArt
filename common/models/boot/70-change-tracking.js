(function () {
  'use strict';

  module.exports = function (app) {
    var _  = require('lodash');
    var modelCfg = require('../model-config');
    // var db = app.dataSources.db,

    // TODO(ritch) this should be unecessary soon....
    _.chain(Object.keys(modelCfg)
    ).without('_meta'
    ).map(
      function (name) {
        return app.models[name];
      }
    ).filter(
      function (model) {
        return !_.isUndefined(model.Change);
      }
    ).each(
      function (model) {
        app.model(model.getChangeModel());
        console.log('Added change model for: ', model.name);
      }
    );

    //.map(function (name) { console.log(db[name]); return db[name]; })
    //   .filter(function(model) { console.error(model); return _.isDefined(model.Change); })
    //   .valueOf();
    // console.log(models);

    // var Todo = app.models.Todo;
    // app.model(Todo.getChangeModel());
  };
}).call();
