/**
 * Created by jheinnic on 12/31/16.
 */
import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {Subscription, AsyncSubject} from "rxjs";
import {RealTime} from "../sdk/services/core/real.time";
import {BASE_URL, API_VERSION} from "../base-url.values";
import {LoopBackConfig} from "../sdk/lb.config";
import {FireLoop} from "../sdk/models/FireLoop";

@Injectable()
export class RealTimeManagerService
{
  private readonly returnSubject = new AsyncSubject<FireLoop>();

  private rtSubscription: Subscription;
  private selfSubscription: Subscription;
  private disconnectSubscription: Subscription;
  private disposed: boolean = false;


  constructor(private readonly realTime: RealTime) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);

    this.openSocket();
  }

  private openSocket() {
    this.rtSubscription = this.realTime.onReady()
      .subscribe(
        () => {
          this.monitorSocket()
        },
        (err: any) => {
          console.error('Halting on fatal error: ', err);

          if (this.disconnectSubscription) {
            this.disconnectSubscription.unsubscribe();
          }

          this.rtSubscription.unsubscribe();
          this.returnSubject.complete();
        },
        () => {
          this.rtSubscription = undefined;
          if (this.disposed) {
            this.returnSubject.complete();
          }
        }
      );
  }

  private monitorSocket() {
    this.disconnectSubscription = this.realTime.onDisconnect()
      .subscribe(() => {
        this.disconnectSubscription.unsubscribe();
        if (this.rtSubscription) {
          this.rtSubscription.unsubscribe();
        }

        if (!this.disposed) {
          console.log("Retrying on premature disconnect");
          this.openSocket();
        } else {
          console.log("Resting after normal disposal disconnect");
        }
      }, (err: any) => {
        console.error("Disconnection monitoring error", err);
        this.disconnectSubscription.unsubscribe();
        if (this.rtSubscription) {
          this.rtSubscription.unsubscribe();
        }

        if (!this.disposed) {
          console.log("Retrying on premature disconnect");
          this.openSocket();
        } else {
          console.log("Resting after abnormal disposal disconnect");
        }
      }, () => {
        this.disconnectSubscription = undefined;
      });

    this.returnSubject.next(this.realTime.FireLoop);
  }

  public get connection(): Observable<FireLoop> {
    return this.returnSubject.asObservable();
  }

  public dispose() {
    this.disposed = true;

    if (this.disconnectSubscription) {
      this.disconnectSubscription.unsubscribe();
    }
    if (this.rtSubscription) {
      this.rtSubscription.unsubscribe();
    }
  }
}
