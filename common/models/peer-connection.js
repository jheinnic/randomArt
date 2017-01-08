// Copyright IBM Corp. 2014,2016. All Rights Reserved.
// Node module: loopback-component-passport
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0
'use strict';
var SG = require('strong-globalize');
var g = SG();

/**
 * Tracks Open PeerJS client connections to serve registry functions.
 *
 * @param {String} peerId The unique connection ID allocated for a peer.
 * @param {String} active Rudimentary offline indicator flag.
 * @param {*} userId The LoopBack user ID.
 * @param {Date} created The created date
 * @param {Date} modified The last modified date
 *
 * @class
 * @inherits {DataModel}
 */

module.exports = function(PeerConnection) {
  var loopback = require('loopback');
  var utils = require('./utils');

  /**
   * Link a PeerJS Connection to a LoopBack user
   * @param {*} userId The loopback user id
   * @param {String} peerId The peer's connection Id
   * @param {Object} [options] The options
   * @callback {Function} cb The callback function
   * @param {Error|String} err The error object or string
   */
  PeerConnection.link = function(userId, peerId, options, cb) {
    options = options || {};
    if (typeof options === 'function' && cb === undefined) {
      cb = options;
      options = {};
    }
    var peerConnectionModel = utils.getModel(this, PeerConnection);
    peerConnectionModel.findOne({where: {
      userId: userId,
      active: true
    }}, function(err, activeConnection) {
      if (err) {
        return cb(err);
      }

      var doCreatePeerConnection = function doCreatePeerConnection(err) {
        if (err) {
          return cb(err);
        }

        // Create the linked account
        peerConnectionModel.create({
          userId: userId,
          peerId: peerId,
          active: true,
          created: date,
          modified: date,
        }, function(err, i) {
          cb(err, i);
        });
      };

      var date = new Date();
      if (activeConnection) {
        // Mark the existing connection inactive to make way for the new one.
        activeConnection.active = false;
        activeConnection.updateAttributes({active: false, modified: date}, doCreatePeerConnection);
      } else {
        doCreatePeerConnection();
      }
    });
  };

  return PeerConnection;
};
