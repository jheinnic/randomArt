/**
 * Created by jheinnic on 12/31/16.
 */
import {Injectable} from "@angular/core";
import {BASE_URL, API_VERSION} from "../shared/base-url.values";
import {LoopBackConfig} from "../shared/sdk/lb.config";
import {ImageChain} from "../shared/sdk/models/ImageChain";
import {Observable} from "rxjs/Observable";
import {ImageChainApi} from "../shared/sdk/services/custom/ImageChain";

@Injectable()
export class ImageChainCacheService
{
  private readonly imageChainSource: Observable<ImageChain[]>;
  private imageChainCache: Immutable.List<ImageChain>;


  constructor(private readonly imageChainApi: ImageChainApi) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);

    this.imageChainSource = this.imageChainApi.find<ImageChain>({
      offset: 0,
      order: "pixelCount ASC, pixelHeight ASC, pixelWidth ASC"
    }).share(); // publishReplay();

    let tempSubscription = this.imageChainSource.subscribe(
      (chains: ImageChain[]) => {
        this.imageChainCache = Immutable.List<ImageChain>(chains);
      })
  }

  public getImageChainCache(): Observable<ImageChain[]> | Immutable.List<ImageChain> {
    if (!! this.imageChainCache) {
      return this.imageChainCache;
    }

    return this.imageChainSource;
  }
}
