/**
 * Created by jheinnic on 12/31/16.
 */
import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {RealTime} from "../shared/sdk/services/core/real.time";
import {BASE_URL, API_VERSION} from "../shared/base-url.values";
import {LoopBackConfig} from "../shared/sdk/lb.config";
import {ImageChain} from "../shared/sdk/models/ImageChain";
import {FireLoopRef} from "../shared/sdk/models/FireLoopRef";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ImageChainDefResolver implements Resolve<Observable<Pool>>
{
  private reference: FireLoopRef<ImageChain>;
  private chains: Observable<ImageChain>;

  constructor(private readonly rt: RealTime) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
  }

  resolve(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): Observable<ImageChain> {
    this.reference = this.rt.FireLoop.ref<ImageChain>(ImageChain);

    this.chains = this.reference.on("changes", {
      offset: 0,
      order: "pixelCount ASC, pixelHeight ASC, pixelWidth ASC"
    });

    return this.chains;
  }
}
