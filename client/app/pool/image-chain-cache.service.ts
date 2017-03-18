///<reference path="../../../node_modules/rxjs/add/operator/mergeMap.d.ts"/>
/**
 * Created by jheinnic on 12/31/16.
 */
import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {RealTime} from "../shared/sdk/services/core/real.time";
import {BASE_URL, API_VERSION} from "../shared/base-url.values";
import {LoopBackConfig} from "../shared/sdk/lb.config";
import {ImageChain} from "../shared/sdk/models/ImageChain";
import {Observable} from "rxjs/Observable";
import {Subscription, Subject} from "rxjs";
import {FireLoopRef} from "../shared/sdk/models/FireLoopRef";

@Injectable()
export class ImageChainDefResolver implements Resolve<Observable<ImageChain[]>>
{
  private readonly returnSubject = new Subject<ImageChain[]>();
    // .share();

  private rtSubscription: Subscription;
  private imageChainSubsn: Subscription;
  private fireLoopRef: FireLoopRef<ImageChain>;


  constructor(private readonly realTime: RealTime) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);

    this.rtSubscription = this.realTime.onReady().subscribe(
      () => {
        this.fireLoopRef = this.realTime.FireLoop
          .ref<ImageChain>(ImageChain);
        this.imageChainSubsn =
          this.fireLoopRef.on("change", {
            offset: 0,
            order: "pixelCount ASC, pixelHeight ASC, pixelWidth ASC"
          }).subscribe(
            (newData:ImageChain[]) => {
              this.returnSubject.next(newData);
            },
            (err:any) => {
              console.error(err);
              this.imageChainSubsn.unsubscribe();
            },
            () => {
              this.imageChainSubsn = undefined;
            }
          );
      },
      (err:any) => {
        console.error(err);
        this.rtSubscription.unsubscribe();
      },
      () => { this.rtSubscription = undefined; }
    );
  }

  resolve(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): Observable<ImageChain[]> {
    return this.returnSubject.asObservable();
  }
}
