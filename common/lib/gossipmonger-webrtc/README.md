# gossipmonger-web-rtc-transport

_Stability: 1 - [Experimental](https://github.com/tristanls/stability-index#stability-1---experimental)_

[![NPM version](https://badge.fury.io/js/gossipmonger-web-rtc-transport.png)](http://npmjs.org/package/gossipmonger-webrtc-transport)

TCP Transport for [Gossipmonger](https://github.com/tristanls/gossipmonger) (an implementation of the Scuttlebutt gossip protocol endpoint for real-time peer-to-peer replication).

## Contributors

[@jheinnic](https://github.com/jheinnic)

## Usage

```javascript
var GossipmongerWebRtcTransport = require('gossipmonger-webrtc-transport');
var transport = new GossipmongerWebRtcTransport();

transport.on('deltas', function (remotePeer, deltas) {
    // process deltas
});

transport.on('digest', function (remotePeer, digest) {
    // process digest
});

transport.on('error', function (error) {
    // process the error
    // if error handler is not registered if an error occurs it will be thrown
});

transport.on('listening', function () {
    console.log('listening...'); 
});

transport.listen();
```

## Tests

    npm test

## Overview

WebRTC Transport for [Gossipmonger](https://github.com/tristanls/node-gossipmonger).

## Documentation

### WebRtcTransport

**Public API**

  * [WebRtcTransport.listen(\[options\], \[callback\])](#webrtctransportlistenoptions-callback)
  * [new WebRtcTransport(\[options\])](#new-webrtctransportoptions)
  * [webRtcTransport.close(\[callback\])](#webrtctransportclosecallback)
  * [webRtcTransport.deltas(remotePeer, localPeer, deltasToSend)](#webrtctransportdeltasremotepeer-localpeer-deltastosend)
  * [webRtcTransport.digest(remotePeer, localPeer, digestToSend)](#webrtctransportdigestremotepeer-localpeer-digesttosend)
  * [webRtcTransport.listen(\[options\],\[callback\])](#webrtctransportlistenoptions-callback-1)
  * [Event 'deltas'](#event-deltas)
  * [Event 'digest'](#event-digest)
  * [Event 'error'](#event-error)
  * [Event 'listening'](#event-listening)

### WebRtcTransport.listen([options], [callback])

  * `options`: See `new WebRtcTransport(options)` `options`.
  * `callback`: See `webRtcTransport.listen(callback)` `callback`.
  * Return: _Object_ An instance of WebRtcTransport with server listening on host and port as specified in options or defaults.

Creates new TCP transport and starts the server.

### new WebRtcTransport([options])

  * `options`: _Object_ _(Default: {})_
    * `host`: _String_ _(Default: 'localhost')_
    * `port`: _Integer_ _(Default: 9742)_ A port value of zero will assign a random port.

Creates a new TCP transport. The `host` and `port` specified in the `options` will be the ones advertised to other peers to connect to. They must be reachable from the "outside".

If "internal" `host` and `port` are different from the "outside" ones, specify the "internal" version in `options` when calling [transport.listen(\[options\], \[callback\])](#webrtctransportlistenoptions-callback-1)

### webRtcTransport.close([callback])

  * `callback`: _Function_ _(Default: undefined)_ `function () {}` Optional callback to call once the server is stopped.

Stops the server from listening to requests from other peers.

### webRtcTransport.deltas(remotePeer, localPeer, deltasToSend)

  * `remotePeer`: _Object_ Peer to send rpc to.
    * `transport`: _Object_ TCP transport data.
      * `host`: _String_ Host to connect to.
      * `port`: _Integer_ Port to connect to.
  * `localPeer`: _Object_ Sender peer.
    * `id`: _String_ Sender peer id.
    * `transport`: _Object_ TCP transport data.
      * `host`: _String_ Host to connect to.
      * `port`: _Integer_ Port to connect to.
  * `deltasToSend`: _Any_ Deltas to send.

Sends `deltasToSend` to the `remotePeer`.

### webRtcTransport.digest(remotePeer, localPeer, digestToSend)

  * `remotePeer`: _Object_ Peer to send rpc to.
    * `transport`: _Object_ TCP transport data.
      * `host`: _String_ Host to connect to.
      * `port`: _Integer_ Port to connect to.
  * `localPeer`: _Object_ Sender peer.
    * `id`: _String_ Sender peer id.
    * `transport`: _Object_ TCP transport data.
      * `host`: _String_ Host to connect to.
      * `port`: _Integer_ Port to connect to.
  * `digestToSend`: _Any_ Digest to send.

Sends `digestToSend` to the `remotePeer`.

### webRtcTransport.listen([options], [callback])

  * `options`: _Object_ _(Default: {})_
    * `host`: _String_ _(Default: as specified on construction)_ Hostname or IP to listen on.
    * `port`: _Integer_ _(Default: as specified on construction)_ Port number to listen on.
  * `callback`: _Function_ _(Default: undefined)_ `function () {}` Optional callback to call once the server is up.

Starts the server to listen to requests from other peers.

### webRtcTransport.rpc(remotePeer, payload)

_**CAUTION: reserved for internal use**_

  * `remotePeer`: _Object_ Peer to send rpc to.
    * `transport`: _Object_ TCP transport data.
      * `host`: _String_ Host to connect to.
      * `port`: _Integer_ Port to connect to.
  * `payload`: _String_ or _Object_ Payload is send on the wire. If an _Object_ is provided, it will be `JSON.stringify()`'ed.

An internal common implementation for `webRtcTransport.deltas(...)` and `webRtcTransport.digest(...)`.

### Event `deltas`

  * `function (remotePeer, deltas) {}`
    * `remotePeer`: _Object_
      * `id`: _String_ Id of the peer.
      * `transport`: _Any_ Any data identifying this peer to the transport mechanism that is required for correct transport operation.    
    * `deltas`: _Any_ Received deltas.

Emitted when WebRtcTransport receives `deltas` from a peer.

### Event `digest`

  * `function (remotePeer, digest) {}`
    * `remotePeer`: _Object_
      * `id`: _String_ Id of the peer.
      * `transport`: _Any_ Any data identifying this peer to the transport mechanism that is required for correct transport operation.
    * `digest`: _Any_ Received digest.

Emitted when WebRtcTransport receives `digest` from a peer.

### Event `error`

  * `function (error) {}`
    * `error`: _Object_ An error that occurred.

Emitted when WebRtcTransport encounters an error. If no handler is registered, an exception will be thrown.

### Event `listening`

  * `function () {}`

Emitted when WebRtcTransport starts listening for connections from peers.
