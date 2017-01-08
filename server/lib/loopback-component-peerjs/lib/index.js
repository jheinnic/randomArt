// Copyright IBM Corp. 2014,2016. All Rights Reserved.
// Node module: loopback-component-passport
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

'use strict';

var path = require('path');
var SG = require('strong-globalize');
SG.SetRootDir(path.join(__dirname, '..'));

var loopback = require('loopback');

module.exports = require('./peerjs-configurator');
