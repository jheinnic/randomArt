var PeerjsTransport = require('../common/lib/gossipmonger-webrtc
var config = {
  host: '192.168.5.3',
  port: 8500,
  id: 'fixedId'
];
var transport = new PeerjsTransport(config);
transport.listen(function(err, data) {
  console.log(err);
  console.log(data);

  runGossip(transport);
}


function runGossip(transport) {
  var Gossipmonger = require('gossipmonger');
  var gossipmonger = new Gossipmonger(
    { // peerInfo
      id: "localId",
      transport: { // default gossipmonger-tcp-transport data
        host: "localhost",
        port: 9742
      }
    },
    { // options
      seeds: [
        {id: "seed1", transport {/*...*/}},
        {id: "seed2", transport {/*...*/}},
        {id: "seed3", transport {/*...*/}}
      ]
    }
  );
  
  gossipmonger.on('error', function (error) {
    console.dir(error); 
  });
  
  gossipmonger.on('new peer', function (newPeer) {
    console.log("found new peer " + newPeer.id + " at " + newPeer.transport);
  });
  
  gossipmonger.on('peer dead', function (deadPeer) {
    console.log("peer " + deadPeer.id + " is now assumed unreachable");
  });
  
  gossipmonger.on('peer live', function (livePeer) {
    console.log("peer " + livePeer.id + " is live again");
  });
  
  gossipmonger.on('update', function (peerId, key, value) {
    console.log("peer " + peerId + " updated key " + key + " with " + value);
  });
}
