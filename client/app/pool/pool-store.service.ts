/**
 * Created by jheinnic on 12/31/16.
 */

import {Injectable, OnDestroy} from "@angular/core";
import {BASE_URL, API_VERSION} from "../shared/base-url.values";
import {LoopBackConfig} from "../shared/sdk/lb.config";
import {FireLoop} from "../shared/sdk/models/FireLoop";
import {FireLoopRef} from "../shared/sdk/models/FireLoopRef";
import {
  RealTimeManagerService
} from "../shared/service-util/real-time-manager.service";
import {Observable} from "rxjs/Observable";
import {Pool} from "../shared/sdk/models/Pool";
import {UserApi} from "../shared/sdk/services/custom/User";
import {Subscription} from "rxjs/Subscription";
import {BehaviorSubject} from "rxjs";
import {LoopBackFilter} from "../shared/sdk/models/BaseModels";

@Injectable()
export class PoolStoreService
{
  private userId: string;
  private poolSub: Subscription;
  private poolRef: FireLoopRef<Pool>;
  private onReady: BehaviorSubject<boolean>;

  constructor(
    private readonly realTime: RealTimeManagerService, private readonly authSvc: UserApi
  ) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
    this.onReady = new BehaviorSubject<boolean>(false);
  }

  public initForUser(): Observable<boolean> {
    if (! this.authSvc.getCurrentId()) {
      return Observable.empty<boolean>();
    }

    this.poolSub = this.realTime.connection.subscribe(
      (fireLoop: FireLoop) => {
        this.poolRef = fireLoop.ref<Pool>(Pool);
        this.onReady.next(true);
      },
      (err: any) => {
        console.error('Could not acquire fireloop Pool reference', err);
      },
      () => {
        console.log('End of socket subscription?');
      });

    return this.onReady.asObservable();
  }

  public isReady() {
    return !! this.poolRef;
  }

  public subscribeWithFilter(filter: LoopBackFilter): Observable<Pool|Pool[]> {
    let retVal: Observable<Pool|Pool[]>;

    if (!! this.poolRef) {
      retVal = this.poolRef.on('change', filter);
    } else {
      retVal = undefined;
    }

    return retVal;
  }

  public create(newItem: Pool): Observable<Pool> {
    let retVal: Observable<Pool>;
    if (this.isReady) {
      retVal = this.poolRef.create(newItem);
    } else {
      retVal = undefined;
    }

    return retVal;
  }
}
