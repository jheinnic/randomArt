import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {PeerConnectService} from "./peer-connect.service";
import {IGossipmonger} from "./gossipmonger";
import path = require('path');


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

  constructor(
    route: ActivatedRoute,
    // private readonly peerService: PeerConnectService,
    private readonly gossipmonger:IGossipmonger
  ) {
    route.params.subscribe((params: Params) => {
      let seedId = parseInt(params['seedId']);
      this.localId = this.gossipmonger.localPeer.id;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    // TODO: How to disconnect???
    // this.peerService.disconnect(this.localId);
    // this.gossipmonger;
  }
}


