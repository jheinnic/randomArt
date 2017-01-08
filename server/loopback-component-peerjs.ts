/**
 * Created by jheinnic on 1/7/17.
 */

export function peerjs(loopbackApplication, options) {
  var ExpressPeerServer = require('peer').ExpressPeerServer;
  var _ = require('lodash');

  var options = _.merge({}, options, { debug: true });

  loopbackApplication.use('/peer2peer/api', ExpressPeerServer(loopbackApplication, options));
}
