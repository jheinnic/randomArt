/**
 * Created by jheinnic on 12/31/16.
 */
import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {RealTime} from "../shared/sdk/services/core/real.time";
import {BASE_URL, API_VERSION} from "../shared/base-url.values";
import {LoopBackConfig} from "../shared/sdk/lb.config";
import {Observable} from "rxjs/Observable";
import {Pool} from "../shared/sdk/models/Pool";

@Injectable()
export class ResourcePathPoolResolver implements Resolve<Observable<Pool>>
{
  constructor(private readonly rt: RealTime) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
  }

  resolve(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): Observable<Pool> {
    const poolId = route.data['poolId'];

    return this.rt.FireLoop
      .ref<Pool>(Pool)
      .on("changes", {where: {id: poolId}});
  }
}
