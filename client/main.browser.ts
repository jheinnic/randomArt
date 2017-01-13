/*
 * Angular bootstraping
 */
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {decorateModuleRef} from "./app/environment";
import {bootloader} from "@angularclass/hmr";

// var Peer = PeerJs.Peer;
// var _ = require('lodash');
// import { Peer } from '../node_modules/peerjs';
// import {Peer} from "peer";
// import "script-loader!peer";
import * as _ from "lodash";


/*
 * App Module
 * our top level module that holds all of our components
 */
import {AppModule} from "./app";
import {HttpModule} from "@angular/http"
import {NgModule, NgModuleRef} from "@angular/core";
import {DurableCanvasService} from "./app/shared/canvas-cache/durable-canvas.service";

// import "@angular/material/core/theming/prebuilt/purple-green";
require("./assets/css/app.scss");
require("./assets/css/ng-material/app.theme.scss");
require("./assets/css/bootstrap/bootstrap.scss");

/*
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
*/


//
// Bootstrap our Angular app with a top level NgModule
//
export function main(): Promise<any> {
  return platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(decorateModuleRef)
    .then((rootModule: NgModuleRef<AppModule>) => {
      let injector = rootModule.injector;
      let canvasCache = injector.get(DurableCanvasService);
      let canvasCacheDOM = document.getElementById('canvas-store');
      canvasCache._bootstrapPortalHost(canvasCacheDOM);
    })
    .catch(err => console.error(err));
}

// needed for hmr
// in prod this is replace for document ready
bootloader(main);
