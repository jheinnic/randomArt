/**
 * Created by jheinnic on 12/31/16.
 */
///<reference path='../../../node_modules/immutable/dist/immutable.d.ts'/>

import {Injectable} from "@angular/core";
import {BASE_URL, API_VERSION} from "../shared/base-url.values";
import {LoopBackConfig} from "../shared/sdk/lb.config";
import {ImageChain} from "../shared/sdk/models/ImageChain";
import {Observable} from "rxjs/Observable";
import {ImageChainApi} from "../shared/sdk/services/custom/ImageChain";
import Immutable = require("immutable");

@Injectable()
export class ImageChainCacheService
{
  private readonly imageChainCache: Observable<Immutable.List<ImageChain>>;


  constructor(private readonly imageChainApi: ImageChainApi) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);

    this.imageChainCache = this.imageChainApi.find<ImageChain>({
      offset: 0,
      order: "pixelCount ASC, pixelHeight ASC, pixelWidth ASC"
    }).map(
      (chains: ImageChain[]) => {
        return Immutable.List<ImageChain>(chains);
      }).publishReplay();
  }

  public getImageChainCache(): Observable<Immutable.List<ImageChain>> {
    return this.imageChainCache;
  }
}

