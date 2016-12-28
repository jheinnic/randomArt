/*

deltas.js - gossipmongerWebRtcTransport.deltas() test

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

var net = require('net'),
    WebRtcTransport = require('../index.js');

var test = module.exports = {};

test['rpc() captures client error and propagates it to a transport event'] = function (test) {
    test.expect(1);
    var webRtcTransport = new WebRtcTransport();
    var remotePeer = {id: "remote", transport: {
      ice: [{urls: "stun:stun.services.mozilla.com"}], host: 'localhost', port: 11234}};
    webRtcTransport.on('error', function () {
        test.ok(true); // client connection error caught
        test.done();
    });
    webRtcTransport.rpc(remotePeer, "payload");
};

test["rpc() emits transport error if remotePeer is malformed"] = function (test) {
    test.expect(1);
    var webRtcTransport = new WebRtcTransport();
    var remotePeer = {id: "remote"};
    webRtcTransport.on('error', function (error) {
        test.equal(error.message, "malformed remotePeer"); // client connection error caught
        test.done();
    });
    webRtcTransport.rpc(remotePeer, "payload");
};
