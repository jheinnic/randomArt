
// var Peer = PeerJs.Peer;
// import {Peer} from "peer";
// import "script-loader!peer";
import * as _ from "lodash";


function onConnectToNet(index, id) {
  idList[index] = id;
  console.log('Connection index ', index, ' has id ', id);
}

function onKnownReceive(localIndex, remoteIndex, data) {
  console.log(localIndex, ' received <' + data + '> from ', remoteIndex);
}

function onUnknownReceive(localIndex, data) {
  console.log(localIndex, ' received <' + data + '> from a connected peer');
}

var recvConn = null;
function onConnectFromPeer(localIndex, conn) {
  // Log the connection
  console.log(idList[localIndex] + 'received peer connection from ', conn);
  recvConn = conn;

  // Receive messages
  conn.on('data', _.partial(onUnknownReceive, localIndex));

  // Send a message
  conn.send('Hello from ' + localIndex);
}

function onConnectToPeer(localIndex, remoteIndex, conn) {
  // Log the connection
  console.log('Established peer connection from <' + localIndex + '> to <' + remoteIndex + '>: ', conn);

  // Receive messages
  conn.on('data', _.partial(onKnownReceive, localIndex, remoteIndex));

  // Send a message
  conn.send('Hello to ' + remoteIndex + ' from ' + localIndex);
}

var config = {
  host: '192.168.5.3',
  port: 8500
};
var peerList = [ new Peer( config ), new Peer( config ), new Peer( config ) ];
var idList = [undefined, undefined, undefined];

for (var ii=0; ii<3; ii++) {
  peerList[ii].on('open', _.partial(onConnectToNet, ii));
  peerList[ii].on('connection', _.partial(onConnectFromPeer, ii));
}

function haveCrosstalk() {
  for (var ii=0; ii<3; ii++) {
    var bob = peerList[ii]
    var bobId = idList[ii];

    for (var jj=ii+1; jj<3; jj++) {
      var alice = peerList[jj];
      var aliceId = idList[jj];

      var aliceToBob = alice.connect(bobId);
      aliceToBob.on('open', _.partial(onConnectToPeer, aliceId, bobId, aliceToBob));

      var bobToAlice = bob.connect(aliceId);
      bobToAlice.on('open', _.partial(onConnectToPeer, bobId, aliceId, bobToAlice));
    }
  }

  setTimeout(haveCrosstalk, 15000);
}

setTimeout(haveCrosstalk, 3000);
