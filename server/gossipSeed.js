var NUM_SEEDS = 3;
var seeds = require('./seeds.json').slice(0, NUM_SEEDS);
var uuid = require('uuid');
var process = require('process');
var Gossipmonger = require('gossipmonger');
var PeerjsTransport = require('../common/lib/gossipmonger-webrtc');

var param = process.argv[1];
var localId;
var seedId;
if (param === 'peer') {
  seedId = -1;
  localId = uuid.v4();
} else {
  seedId = parseInt(param);
  localId = seeds.splice(seedId, 1)[0];
}

if(localId === undefined) {
  throw new Error('Invalid argument, ' + param + '.  Could not determine local Id.');
}

var localConfig = {
  host: '192.168.5.3',
  port: 8500,
  id: localId
};
var localTransport = new PeerjsTransport(localConfig);

var seedTransports = seeds.map(function(remoteId) {
  var remoteConfig = {
    host: '192.168.5.3',
    port: 8500,
    id: remoteId
  };
  return {
    id: remoteId,
    transport: new PeerjsTransport(remoteConfig)
  };
});

localTransport.listen(function(err, data) {
  console.log(err);
  console.log(data);

  runGossip(localId, localTransport, seedTransports);
});


function runGossip(localId, localTransport, seedTransports) {
  var gossipmonger = new Gossipmonger(
    { // peerInfo
      id: localId,
      transport: localTransport
    },
    { // options
      seeds: seedTransports
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
