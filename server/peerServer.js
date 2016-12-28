var fs = require('fs');
var path = require('path');
var PeerServer = require('peer').PeerServer;

var config = {
  debug: true,
  port: 8500,
  path: '/'
};
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
console.log(foo);
var server = PeerServer(config);
server.on('connection', function(id) { console.log('Connection from ', id); });
server.on('disconnect', function(id) { console.log('Disconnection from ', id); });

console.log(server);
module.exports = server;
