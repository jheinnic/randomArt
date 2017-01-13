/**
 * Created by jheinnic on 1/12/17.
 */
import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {PeerConnectService} from "./peer-connect.service";
import {Observable} from "rxjs/Observable";
import {ReplaySubject} from "rxjs/ReplaySubject"
import Gossipmonger = require('gossipmonger');
import {AsyncScheduler} from "rxjs/scheduler/AsyncScheduler";

@Injectable()
class NavbarDataResolver implements Resolve<Gossipmonger>
{
  constructor(private connectService: PeerConnectService) {}

  resolve(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): Observable<Gossipmonger> {
    let seedId = route.params['seedId'];
    this.connectService.seedCluster(seedId);
  }
}

