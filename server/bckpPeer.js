var fs = require('fs');
var path = require('path');
var http = require('http');
var express = require('express');
var ExpressPeerServer = require('peerjs-server').ExpressPeerServer;

var app = express();
var server = http.createServer(app);
var peerServer = ExpressPeerServer(app, { });
var foo = {
  ssl: {
    key: fs.readFileSync(path.resolve(
      __dirname, path.join('..', 'config', 'ca.key')
    )),
    cert: fs.readFileSync(path.resolve(
      __dirname, path.join('..', 'config', 'ca.crt')
    ))
  }
};

app.use('/peerjs', peerServer);

server.listen(8500);
server.on('connection', function(id) { console.log('Connection from ', id); });
server.on('disconnect', function(id) { console.log('Disconnection from ', id); });

