/*

 index.js - "gossipmonger-tcp-transport": TCP Transport for Gossipmonger

 The MIT License (MIT)

 Copyright (c) 2013 Tristan Slominski

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.

 */
"use strict";

var PeerJs = require('peerjs');
var events = require('events');
var util = require('util');

var LARGE_PAYLOAD_MIN_SIZE = 100 * 1024 * 1024;

/*
 * `options`: _Object_ _(Default: {})_
 * `host`: _String_ _(Default: `localhost`)_ Hostname or IP.
 * `port`: _Integer_ _(Default: 9742)_ Port number.
 */
var PeerjsTransport = module.exports = function PeerjsTransport(options) {
  var self = this;
  events.EventEmitter.call(self);

  options = options || {};

  self.id = options.id || uuid.v4()
  self.host = options.host || 'localhost';
  self.port = options.port || 8500;
  self.iceList = options.iceList || ['TODO'];
};

util.inherits(PeerjsTransport, events.EventEmitter);

/*
 * `options`: See `new PeerjsTransport(options)` `options`.
 * `callback`: See `tcpTransport.listen(callback)` `callback`.
 Return: _Object_ An instance of PeerjsTransport with inbound peer listening for
 connections on an ID key assigned by the server whose host/port was given
 in options or used by defaults.
 */
PeerjsTransport.listen = function listen(options, callback) {
  var tcpTransport = new PeerjsTransport(options);
  tcpTransport.listen(callback);
  return tcpTransport;
};


/*
 * `callback`: _Function_ _(Default: undefined)_ Optional callback to call once
 the server is stopped.
 */
PeerjsTransport.prototype.close = function close(callback) {
  var self = this;
  if (self.server)
    self.server.close(callback);
};


/*
 * `remotePeer`: _Object_ Peer to send rpc to.
 * `transport`: _Object_ TCP transport data.
 * `host`: _String_ Broker host to connect to.
 * `port`: _Integer_ Broker Port to connect to.
 * `id`: Remote peer's registered id with the broker host.
 * `localPeer`: _Object_ Sender peer.
 * `transport`: _Object_ TCP transport data.
 * `host`: _String_ Broker Host to connect to.
 * `port`: _Integer_ Broker Port to connect to.
 * `id`: _String_ Local peer and sender identity with the broker..
 * `deltasToSend`: _Any_ Deltas to send.
 */
PeerjsTransport.prototype.deltas = function deltas(remotePeer, localPeer, deltasToSend) {
  var self = this;

  self.rpc(remotePeer, {
    deltas: deltasToSend,
    sender: {
      id: localPeer.id,
      transport: localPeer.transport
    }
  });
};


/*
 * `remotePeer`: _Object_ Peer to send rpc to.
 * `transport`: _Object_ TCP transport data.
 * `host`: _String_ broker Host to connect to.
 * `port`: _Integer_ broker Port to connect to.
 * `id`: Identity of remote peer through broker.
 * `localPeer`: _Object_ Sender peer.
 * `transport`: _Object_ TCP transport data.
 * `host`: _String_ Broker Host to connect to.
 * `port`: _Integer_ Broker Port to connect to.
 * `id`: Identity of local peer through broker.
 * `digestToSend`: _Any_ Digest to send.
 */
PeerjsTransport.prototype.digest = function digest(remotePeer, localPeer, digestToSend) {
  var self = this;

  self.rpc(remotePeer, {
    digest: digestToSend,
    sender: {
      id: localPeer.id,
      transport: localPeer.transport
    }
  });
};


/*
 * `options`: _Object_ _(Default: {})_
 * `host`: _String_ _(Default: as specified on construction)_ Hostname or IP
 of peerJS broker which will listen for requests on our behalf.
 * `port`: _Integer_ _(Default: as specified on construction)_ Port number
 of peerJS broker to register with.
 * `id`: UUID identity of local peer that broker will listen to for connections to and forward
 *       our way.
 * `callback`: _Function_ _(Default: undefined)_ Optional callback to call once
 the server handshake is setup.
 */
PeerjsTransport.prototype.listen = function listen(options, callback) {
  var self = this;

  // options are optional
  options = options || {};

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  self.peerServer = self.connectThroughBroker(callback, options);

  self.peerServer.on('connect', function (remoteConn) {
    var data = '';

    remoteConn.on('open', function () {
      console.log('Established connection confirmed.');
    });
    // TODO: Check serializaition mode option?
    //       binary, binary-utf8, json, or none.
    remoteConn.on('data', function (chunk) {
      data += chunk.toString('utf8');
    });
    remoteConn.on('close', function () {
      try {
        data = JSON.parse(data)
      } catch (exception) {
        // ignore?
        // self.emit('error', exxception);
      }
      if (data.deltas) {
        self.emit('deltas', data.sender, data.deltas);
      } else {
        self.emit('digest', data.sender, data.digest);
      }
    });
    remoteConn.on('error', function (err) {
      console.error(`Error from connection ${remoteConn.label} from ${remoteConn.peer}.  Still open?=${remoteConn.open}}`);
      self.emit('error', error);
    });
  });
};


/*
 * `remotePeer`: _Object_ Peer to send rpc to.
 * `transport`: _Object_ TCP transport data.
 * `host`: _String_ PeerJS Broker to request a connection handshake from..
 * `port`: _Integer_ Port for PeerJS Broker
 * `ID` : of the remote peer which broker will help establish a client transport with.
 * Possibly RTC Turn/Stun configuration too (advanced use case)
 * `payload`: _String_ or _Object_ Payload is send on the wire. If an _Object_
 is provided, it will be `JSON.stringify()`'ed.
 */
PeerjsTransport.prototype.rpc = function rpc(remotePeer, payload) {
  var self = this;
  if (!remotePeer || !remotePeer.transport || !remotePeer.transport.host
    || !remotePeer.transport.port || !remotePeer.transport.id) {
    return self.emit('error', new Error("malformed remotePeer"));
  }
  if ((remotePeer.transport.host !== self.host) || (remotePeer.transport.port !== self.port)) {
    return self.emit('error', new Error('Local and remote transports must traverse the same broker to exchange data.'));
  }

  self.peerClient = self.connectThroughBroker();

  var remoteConfigObj = {reliable: false};
  if (typeof payload !== 'string') {
    remoteConfigObj.serialization = 'json';
    payload = JSON.stringify(payload);
  } else {
    remoteConfigObj.serialization = 'binary-utf8';
    if (payload.length >= LARGE_PAYLOAD_MIN_SIZE) {
      remoteConfigObj.reliable = true;
    }
  }

  var remoteConn = self.peerClient.connect(remotePeer.transport.id, remoteConfigObj);
  remoteConn.on('open', function () {
    remoteConn.send(payload + "\r\n");

    // TODO: Worry about aborting an asynchronously sent message?
    remoteConn.close();
  });
  remoteConn.on('error', function (error) {
    console.error(error);
    self.emit('error', error);
  });
};

PeerjsTransport.prototype.connectThroughBroker = function connectThroughBroker(callback, options) {
  var self = this;
  var config = Object.assign({}, self, options);
  var peerConnect =
    new PeerJs(config.id, {
      id: config.id,
      host: config.host,
      port: config.port,
      config: config.iceList
    });

  if ((typeof callback) === 'function') {
    peerConnect.on('open', callback);
  }
  peerConnect.on('open', function (id) {
    if (id !== self.id.toString()) {
      console.error(`Requested peer identity of ${self.id}, bit was assigned ${id}`);
      var err = new Error(`Requested peer identity of ${self.id}, bit was assigned ${id}`);
      self.emit('error', err);
      throw err;
    }
    self.emit('listening')
  });

  peerConnect.on('error', function (error) {
    self.emit('error', error);
  });

  return peerConnect;
};
