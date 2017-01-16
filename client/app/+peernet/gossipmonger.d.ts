/**
 * Created by jheinnic on 1/12/17.
 */
// import Gossipmonger = require('gossipmonger');

// export interface DigestEntry {
// }

import {EventEmitter} from "events";

export interface PeerInfo {
  id: string;
}
export type DigestEntry = any;

export declare interface IGossipmonger extends EventEmitter {
  localPeer: PeerInfo;
  digest(livePeers: DigestEntry[] ): void;
  gossip() : void;
  update(key : string, value : any ): void;
}
