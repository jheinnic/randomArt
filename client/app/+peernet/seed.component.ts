import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute, Params, Data} from "@angular/router";
import {PeerConnectService} from "./peer-connect.service";
import {IGossipmonger} from "./gossipmonger";
import path = require('path');
import {Subscription} from "rxjs";


@Component({
  moduleId: path.resolve(__dirname, __filename),
  template: `
<span>launching seed {{seedId}} for local id{{localId}}</span>
<span>...receieved peer Id of {{peerId}}</span>
`
})
export class SeedComponent implements OnDestroy
{
  private localId: string;
  private gossipmonger:IGossipmonger;
  private subscription: Subscription;

  constructor(route: ActivatedRoute) {
    this.subscription = route.data.subscribe((data:Data) => {
      this.gossipmonger = data['gossipmonger'];
      this.localId = this.gossipmonger.localPeer.id;
    });
  }

  ngOnDestroy() {
    // TODO: How to disconnect???
    // this.peerService.disconnect(this.localId);
    // this.gossipmonger;

    this.subscription.unsubscribe();
  }
}


