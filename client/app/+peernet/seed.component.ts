import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import PeerjsTransport = require('../../../common/lib/gossipmonger-peerjs-transport');
import Gossipmonger = require('gossipmonger');
import seeds = require('./seeds.json');
import uuid = require('uuid');
import path = require('path');
import {PeerConnectService} from "./peer-connect.service";


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

  constructor(route: ActivatedRoute, private readonly peerService: PeerConnectService) {
    route.params.subscribe((params: Params) => {
      let seedId = parseInt(params['seedId']);
      this.localId = this.peerService.seedCluster(seedId);
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.peerService.disconnect(this.localId);
  }
}


