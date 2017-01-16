/**
 * Created by jheinnic on 1/12/17.
 */
import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {PeerConnectService} from "./peer-connect.service";
import {Observable} from "rxjs/Observable";
import {ReplaySubject} from "rxjs/ReplaySubject"
import {AsyncScheduler} from "rxjs/scheduler/AsyncScheduler";
import {IGossipmonger} from './gossipmonger.d';

@Injectable()
export class SeedConnectResolver implements Resolve<IGossipmonger>
{
  constructor(private connectService: PeerConnectService) {}

  resolve(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): Observable<IGossipmonger> {
    let seedId = route.params['seedId'];
    return this.connectService.seedCluster(seedId);
  }
}

