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
export class ImageChainDefResolver implements Resolve<Observable<ImageChain>>
{
  private reference: FireLoopRef<ImageChain>;
  private chains: Observable<ImageChain>;

  constructor(private readonly rt: RealTime) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
  }

  /*
  private chainDefCache = [
    new ImageChainDef({
      localId: 1,
      uuid: uuid.v4(),
      displayName: 'square, 240 x 240',
      pixelWidth: 240,
      pixelHeight: 240,
      pixelCount: 240 * 240,
      fitOrFill: 'square'
    }), new ImageChainDef({
      localId: 2,
      uuid: uuid.v4(),
      displayName: 'fill, 360 x 240',
      pixelWidth: 360,
      pixelHeight: 240,
      pixelCount: 360 * 240,
      fitOrFill: 'fill'
    }), new ImageChainDef({
      localId: 3,
      uuid: uuid.v4(),
      displayName: 'square, 360 x 360',
      pixelWidth: 360,
      pixelHeight: 360,
      pixelCount: 360 * 360,
      fitOrFill: 'square'
    }), new ImageChainDef({
      localId: 4,
      uuid: uuid.v4(),
      displayName: 'fit, 480 x 360',
      pixelWidth: 480,
      pixelHeight: 360,
      pixelCount: 480 * 360,
      fitOrFill: 'fit'
    }), new ImageChainDef({
      localId: 5,
      uuid: uuid.v4(),
      displayName: 'square, 480 x 480',
      pixelWidth: 480,
      pixelHeight: 480,
      pixelCount: 480 * 480,
      fitOrFill: 'square'
    }), new ImageChainDef({
      localId: 6,
      uuid: uuid.v4(),
      displayName: 'fit, 640 x 480',
      pixelWidth: 640,
      pixelHeight: 480,
      pixelCount: 640 * 480,
      fitOrFill: 'fit'
    }), new ImageChainDef({
      localId: 7,
      uuid: uuid.v4(),
      displayName: 'fill, 640 x 480',
      pixelWidth: 640,
      pixelHeight: 480,
      pixelCount: 640 * 480,
      fitOrFill: 'fill'
    })
  ];
  */

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
