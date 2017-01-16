(function() {
  'use strict';

  module.exports = function(app) {
    var stormpath = require('loopback-stormpath');
    stormpath.init(app);
  };
}).call(this);
