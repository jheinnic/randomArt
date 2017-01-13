/**
 * Created by jheinnic on 1/10/17.
 */
import {AsyncScheduler} from "rxjs/scheduler/AsyncScheduler";
import {ReplaySubject} from "rxjs/ReplaySubject";
import PeerjsTransport = require('../../../common/lib/gossipmonger-peerjs-transport');
import Gossipmonger = require('gossipmonger');
import uuid = require('uuid');
import {Observable} from "rxjs/Observable";
import {Scheduler} from "rxjs";

const NUM_SEEDS: number = 3;

export class PeerConnectService
{
  constructor() { }

  seedCluster(seedIndex: number): Observable<Gossipmonger> {
    let localId: String;
    let seedIds: string[];

    if ((seedIndex < 0) || (seedIndex >= NUM_SEEDS)) {
      throw new Error(`Invalid argument, ${seedIndex}.  Could not determine local Id.`);
    } else {
      let allSeeds = require('./seeds.json');

      seedIds = allSeeds.slice(0, NUM_SEEDS);
      localId = new String(seedIds.splice(seedIndex, 1)[0]);
    }

    return this.connectAsLocalId(localId, seedIds);
  }

  joinCluster() {
    let localId: String = new String(uuid.v4());
    let allSeeds: string[] = require('./seeds.json');

    return this.connectAsLocalId(localId, allSeeds);
  }

  private connectAsLocalId(localId: String, seedIds: string[]): Observable<Gossipmonger> {
    let retVal = new ReplaySubject<Gossipmonger>(4, 30000);

    // Must remove the constructor to convince PeerJS that this is a string, not an object.
    // delete this.localId['constructor'];
    // Object.defineProperty(this.localId, 'constructor', {
    //   value: null
    // });
    // this.localId.constructor = null;
    let localConfig = {
      host: '192.168.5.3',
      port: 8500,
      id: localId
    };
    let localTransport = new PeerjsTransport(localConfig);

    let seedTransports = seedIds.map(function (remoteId) {
      let remoteConfig = {
        host: '192.168.5.3',
        port: 8500,
        id: remoteId
      };
      return {
        id: remoteId,
        transport: new PeerjsTransport(remoteConfig)
      };
    });

    localTransport.listen((peerId: string) => {
      if (peerId != localId) {
        throw new Error(`Listen acknowledged ${peerId} when ${localId} was requested.`);
      } else {
        console.log(`Broker validly acknowledges ${peerId}`);
      }

      this.runGossip(retVal, localId, localTransport, seedTransports);
    });

    return retVal.asObservable();
  }

  runGossip(subject:ReplaySubject<Gossipmonger>, localId: String, localTransport, seedTransports) {
    let gossipmonger = new Gossipmonger({ // peerInfo
      id: localId,
      transport: localTransport
    }, { // options
      seeds: seedTransports,
      transport: localTransport
    });

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
}
