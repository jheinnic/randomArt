// Copyright IBM Corp. 2014,2016. All Rights Reserved.
// Node module: loopback-component-passport
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

'use strict';

var path = require('path');
var SG = require('strong-globalize');
SG.SetRootDir(path.join(__dirname, '../..'));

var loopback = require('loopback');
var DataModel = loopback.PersistedModel || loopback.DataModel;

function loadModel(jsonFile) {
  var modelDefinition = require(jsonFile);
  return DataModel.extend(modelDefinition.name,
    modelDefinition.properties,
    {
      relations: modelDefinition.relations,
    });
}

module.exports.peerConnectionModel = loadModel('./peer-connection.json');

module.exports.PeerConnection = require('./peer-connection')(module.exports.peerConnectionModel);

module.exports.PeerConnection.autoAttach = 'db';
