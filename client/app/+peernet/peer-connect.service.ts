/**
 * Created by jheinnic on 1/10/17.
 */
import {AsyncScheduler} from "rxjs/scheduler/AsyncScheduler";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Observable} from "rxjs/Observable";
import {Scheduler} from "rxjs";
import {IGossipmonger} from './gossipmonger.d';
import PeerjsTransport = require('../../../common/lib/gossipmonger-peerjs-transport');
import Gossipmonger = require('gossipmonger');
import GossipmongerPeer = require('gossipmonger-peer');
import uuid = require('uuid');

const NUM_SEEDS: number = 3;

export class PeerConnectService
{
  constructor() { }

  seedCluster(seedIndex: number): Observable<IGossipmonger> {
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

  joinCluster(): Observable<IGossipmonger> {
    let localId: String = new String(uuid.v4());
    let allSeeds: string[] = require('./seeds.json');

    return this.connectAsLocalId(localId, allSeeds);
  }

  private connectAsLocalId(localId: String, seedIds: string[]): Observable<IGossipmonger> {
    let retVal = new ReplaySubject<IGossipmonger>(4, 30000);

    // Must use String instead of string to convince PeerJS that localId is a string, not a
    // configuration object.
    let localConfig = {
      host: '192.168.5.3',
      port: 8500,
      id: localId
    };

    let localTransport = new PeerjsTransport(localConfig);
    let seedTransports = seedIds.map(
      function (remoteId) {
        let remoteConfig = {
          host: '192.168.5.3',
          port: 8500,
          id: remoteId
        };
        return new GossipmongerPeer(
          remoteId, {
            data: {},
            intervals: [750],
            intervalsMean: 750,
            lastTimme: new Date().getTime(),
            live: true,
            maxVersionSeen: 0,
            MAX_INTERVALS: 100,
            sum: 750,
            transport: new PeerjsTransport(remoteConfig)
          }
        );
      }
    );

    localTransport.listen(
      (peerId: string) => {
        if (peerId != localId) {
          throw new Error(`Listen acknowledged ${peerId} when ${localId} was requested.`);
        } else {
          console.log(`Broker validly acknowledges ${peerId}`);
        }

        retVal.next(
          this.runGossip(localId, localTransport, seedTransports));
      }
    );

    return retVal.asObservable();
  }

  runGossip( localId: String, localTransport:any, seedTransports:any[] ) {
    let gossipmonger = new Gossipmonger({ // peerInfo
      id: localId,
      data: {},
      transport: localTransport,
      maxVersionSeen: 0
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

    return gossipmonger;
  }
}
