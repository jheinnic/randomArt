'use strict';

module.exports = function(app) {
  var db = app.dataSources.db;

  // Instance JSON document
  var xwInst = require('../../examples/example.json');

  // Create a model from the user instance
  var XwGen = db.buildModelFromInstance('XwGen', xwInst, {idInjection: true});

  // Use the model for create, retrieve, update, and delete
  var obj = new XwGen(xwInst);

  console.log(obj.toObject());

  XwGen.create(xwInst, function (err, u1) {
    if (err) {
      console.error(err);
    } else {
      console.log('Created: ', u1.toObject());
      XwGen.findById(u1.id, function (err, u2) {
        if (err) {
          console.error(err);
        } else {
          console.log('Found: ', u2.toObject());
        }
      });
    }
  });
  // console.log(XwGen);
  // XwGen.build(function(err, u1) {
  //  console.log('Built: ', u1.toObject());
  // });
};
