/**
 * Created by jheinnic on 12/31/16.
 */

import {Injectable, OnDestroy} from "@angular/core";
import {BASE_URL, API_VERSION} from "../shared/base-url.values";
import {LoopBackConfig} from "../shared/sdk/lb.config";
import {FireLoop} from "../shared/sdk/models/FireLoop";
import {FireLoopRef} from "../shared/sdk/models/FireLoopRef";
import {ImageChain} from "../shared/sdk/models/ImageChain";
import {RealTimeManager} from "../shared/service-util/real-time-manager.service";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {Subject} from "rxjs/Subject";

@Injectable()
export class ImageChainCacheService implements OnDestroy
{
  private readonly returnSubject = new Subject<Immutable.List<ImageChain>>();

  private rtSubscription: Subscription;
  private imageChainSubsn: Subscription;
  private fireLoopRef: FireLoopRef<ImageChain>;


  constructor(private readonly realTime: RealTimeManager) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);

    this.rtSubscription = this.realTime.connection.subscribe(
      (fireLoop:FireLoop) => {
        if (this.imageChainSubsn) {
          this.imageChainSubsn.unsubscribe();
        }

        this.fireLoopRef = fireLoop.ref<ImageChain>(ImageChain);
        this.imageChainSubsn =
          this.fireLoopRef.on("change", {
            offset: 0,
            order: "pixelCount ASC, pixelHeight ASC, pixelWidth ASC"
          }).map((data:ImageChain[]) => Immutable.List(data))
            .subscribe(this.returnSubject);
      },
      (err:any) => {
        console.error(err);
        this.rtSubscription.unsubscribe();
      },
      () => { this.rtSubscription = undefined; }
    );
  }

  public getImageChainCache(): Observable<Immutable.List<ImageChain>> {
    return this.returnSubject.asObservable();
  }

  public ngOnDestroy(): void {
    if (this.imageChainSubsn) {
      this.imageChainSubsn.unsubscribe();
      this.imageChainSubsn = undefined;
    }

    if (this.rtSubscription) {
      this.rtSubscription.unsubscribe();
      this.rtSubscription = undefined;
    }

    this.returnSubject.complete();
  }
}
