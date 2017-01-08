// Copyright John Heinnickel, 2016. All Rights Reserved.
// Node module: loopback-component-peerjs
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

'use strict';

module.exports = PeerjsConfigurator;

var loopback = require('loopback');
var ExpressPeerServer = require('peer').ExpressPeerServer;
var SG = require('strong-globalize');
var _ = require('lodash');

var g = SG();


/**
 * The passport configurator
 * @param {Object} app The LoopBack app instance
 * @returns {PassportConfigurator}
 * @constructor
 * @class
 */
function PeerjsConfigurator(loopbackApplication, options) {
  if (!(this instanceof PeerjsConfigurator)) {
    return new PeerjsConfigurator(loopbackApplication, options);
  }

  this.app = loopbackApplication;
  this.options = _.merge({}, options, { debug: true });
  this.peerServer = ExpressPeerServer(this.app, this.options);

  // this.setupModels(this.options);
  this.init();
}

/**
 * Set up data models for user identity/credential and application credential
 * @options {Object} options Options for models
 * @property {Model} [userModel] The user model class
 * @property {Model} [userCredentialModel] The user credential model class
 * @property {Model} [userIdentityModel] The user identity model class
 * @end
 */
PeerjsConfigurator.prototype.setupModels = function(options) {
  options = options || {};

  var models = require('./models');

  // Set up relations
  this.userModel = options.userModel || loopback.getModelByType(this.app.models.User);
  this.peerConnectionModel = models.peerConnectionModel ||
    loopback.getModelByType(this.app.models.PeerConnection);

  if (!this.userModel.relations.peerConnections) {
    this.userModel.hasMany(this.peerConnectionModel, {as: 'peerConnections'});
  } else {
    this.peerConnectionModel = this.userModel.relations.peerConnections.modelTo;
  }

  if (!this.peerConnectionModel.relations.user) {
    this.peerConnectionModel.belongsTo(this.userModel, {as: 'user'});
  }
};

/**
 * Initialize the passport configurator
 * @returns {Passport}
 */
PeerjsConfigurator.prototype.init = function( ) {
  var self = this;
  self.app.middleware('auth', '/peer2peer/api', self.peerServer);
  self.app.middleware('auth', '/peer2peer/api/peerjs', self.peerServer);

  self.app.on('connection', function(peerId) {
    console.log("On connection: " + peerId);
/*
    var PeerConnection = this.app.models.PeerConnection;
    PeerConnection.create({
      peerId: peerId,
      active: true,
      created: date,
      modified: date,
    }, function(err, i) {
      cb(err, i);
    });
*/
  });

  self.app.on('disconnect', function(peerId) {
    console.log("On disconnect: " + peerId);
/*
    var PeerConnection = this.app.models.PeerConnection;
    PeerConnection.findOne(
      {where: {peerId: peerId, active: true}},
      function(err, activeConnection) {
        var date = new Date();
        if (activeConnection) {
          // Mark the existing connection inactive to make way for the new one.
          activeConnection.active = false;
          activeConnection.modified = date;
          activeConnection.updateAttributes({active: false, modified: date}, console.log);
        }
      }
    );
*/
  });

  // var defaultCallback = function (req, res, next) {
};
