/*

digest.js - gossipmongerTcpTransport.digest() test

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
    TcpTransport = require('../index.js');

var test = module.exports = {};

test['digest() connects to remotePeer.host:remotePeer.port'] = function (test) {
    test.expect(1);
    var tcpTransport = new TcpTransport();
    var localPeer = {id: "local", transport: {host: 'localhost', port: 8500, id: '7110aee7-61d6-4454-85c8-c185f24f64be'}};
    var remotePeer = {id: "remote", transport: {host: 'localhost', port: 8500, id: '9578aee7-61d6-4fa4-2ec8-c185f24904be'}};
    var server = net.createServer(function (connection) {
        test.equal(connection.remoteAddress, connection.localAddress);
        connection.on('data', function () {}); // consume data
        connection.on('end', function () {
            server.close(function () {
                test.done();
            });
        });
    });
    server.listen(remotePeer.transport.port, function () {
        tcpTransport.digest(remotePeer, localPeer, [localPeer]);
    });
};

test['digest() sends payload including digest and sender'] = function (test) {
    test.expect(2);
    var tcpTransport = new TcpTransport();
    var localPeer = {id: "local", transport: {host: 'localhost', port: 8500, id: '7110aee7-61d6-4454-85c8-c185f24f64be'}};
    var remotePeer = {id: "remote", transport: {host: 'localhost', port: 8500, id: '9578aee7-61d6-4fa4-2ec8-c185f24904be'}};
    var server = net.createServer(function (connection) {
        var data = "";
        connection.on('data', function (chunk) {
            data += chunk.toString('utf8');
        });
        connection.on('end', function () {
            data = JSON.parse(data);
            test.deepEqual(data.sender, localPeer);
            test.deepEqual(data.digest, [localPeer]);
            server.close(function () {
                test.done();
            });
        });
    });
    server.listen(remotePeer.transport.port, function () {
        tcpTransport.digest(remotePeer, localPeer, [localPeer]);
    });
};
