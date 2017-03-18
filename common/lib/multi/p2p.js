/**
 * Created by jheinnic on 2/28/17.
 */
var app = require("express")();
var server = require("http").Server(app);

var p2pserver = require("socket.io-p2p-server").Server;
var io = require("socket.io")(server);

app.use(
  app.static(__dirname));
io.use(p2pserver);

server.listen(3030, function () {
  console.log("Listening on 3030");
});
