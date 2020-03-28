/**
 * Created by jheinnic on 1/2/17.
 */
import {Component, OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {RealTime} from "../shared/sdk/services/core/real.time";
import {FireLoopRef} from "../shared/sdk/models/FireLoopRef";
import {PhraseGeneratorService} from "../shared/phrase-generator/phrase-generator.service";
import {ImageChain} from "../shared/sdk/models/ImageChain";
import {Pool} from "../shared/sdk/models/Pool";
import {Subscription} from "rxjs/Subscription";
import {ImageChainCacheService} from "./image-chain-cache.service";
import {UserApi} from "../shared/sdk/services/custom/User";
import {Observable} from "rxjs";
import {NewPoolModalComponent} from "./new-pool-modal.component";
import {MdDialog, MdDialogRef} from "@angular/material";
import Immutable = require('immutable');


const MIN_QUEUE_SIZE: number = 8;
const MAX_BUFFER_SIZE: number = 2000;
const LIVE_LATENCY: number = 600;


@Component({
  moduleId: "app/pool/pool-list.component'",
  selector: "pool-list",
  inputs: [],
  template: require("./_pool-list.view.html"),
  styleUrls: ["./_image-lobby.scss"]
})
export class PoolListComponent
  implements OnDestroy
{
  // private routeSnapshot: ActivatedRouteSnapshot;

  private imageChainSubsn?: Subscription;
  private allImageChains: Immutable.List<ImageChain>;

  private poolRefSub?: Subscription;

  private poolSub?: Subscription;
  private poolFireLoopRef?: FireLoopRef<Pool>;
  private poolList: Immutable.List<Pool>;

  private newPoolDialogRef: MdDialogRef<NewPoolModalComponent>;

  constructor(private readonly route: ActivatedRoute, private readonly userApi: UserApi,
    private readonly phraseGen: PhraseGeneratorService, private readonly realTime: RealTime,
    private readonly imageChainCache: ImageChainCacheService,
    private readonly dialogSvc: MdDialog
  ) {

    // this.rtSubscription = this.realTime.onReady()
    //   .subscribe(() => {
    //     this.fireLoopRef = this.realTime.FireLoop
    //       .ref<ImageChain>(ImageChain);
    //     this.imageChainSubsn = this.fireLoopRef.on("change", {
    //       offset: 0,
    //       order: "pixelCount ASC, pixelHeight ASC, pixelWidth ASC"
    //     })
    //       .subscribe((newData: ImageChain[]) => {
    //         this.allImageChains = Immutable.List<ImageChain>(newData);
    //       }, (err: any) => {
    //         console.error(err);
    //         this.imageChainSubsn.unsubscribe();
    //       }, () => {
    //         this.imageChainSubsn = undefined;
    //       });
    //   }, (err: any) => {
    //     console.error(err);
    //     this.rtSubscription.unsubscribe();
    //   }, () => { this.rtSubscription = undefined; });

    // this.routeSnapshot = this.route.snapshot;

    let imageChains = this.imageChainCache.getImageChainCache();
    if (imageChains instanceof Observable) {
      this.imageChainSubsn = imageChains.subscribe((chains: Immutable.List<ImageChain>) => {
          this.allImageChains = chains;
        },
        (err: any) => {
          console.error(err);
          if (!!this.imageChainSubsn) {
            this.imageChainSubsn.unsubscribe();
            this.imageChainSubsn = undefined;
          }
        },
        () => { this.imageChainSubsn = undefined; });
    } else {
      this.allImageChains = imageChains;
    }

    this.poolList = Immutable.List<Pool>([]);
    this.poolRefSub = this.realTime.onReady()
      .subscribe((ready: string) => {
          console.log(ready);
          if (!!this.poolRefSub) {
            this.poolFireLoopRef = this.realTime.FireLoop.ref<Pool>(Pool);
            ;

            this.poolRefSub.unsubscribe();
            this.poolRefSub = undefined;
          }
        },
        (err: any) => {
          console.error(err);
          if (!!this.poolRefSub) {
            this.poolRefSub.unsubscribe();
            this.poolRefSub = undefined;
          }
        },
        () => {
          if (!!this.poolFireLoopRef) {
            this.poolSub = this.poolFireLoopRef.on("change",
              {
                offset: 0,
                where: {
                  ownerId: this.userApi.getCurrentId()
                },
                order: "imageChainId ASC, name ASC"
              })
              .map((feedback: Pool | Pool[] | { error: any }) => {
                let retval: Immutable.List<Pool>;
                if (feedback instanceof Pool) {
                  retval = Immutable.List<Pool>([feedback]);
                } else if (feedback instanceof Array) {
                  retval = Immutable.List(feedback);
                } else {
                  throw feedback.error;
                }

                return retval;
              })
              .subscribe((poolList: Immutable.List<Pool>) => {
                  this.poolList = poolList
                },
                (err: any) => {
                  console.error(err);
                  if (!!this.poolSub) {
                    this.poolSub.unsubscribe();
                    this.poolSub = undefined;
                  }
                },
                () => { this.poolSub = undefined; });
          }
        });
  }

  ngOnDestroy() {
    if (this.poolRefSub) {
      this.poolRefSub.unsubscribe();
      this.poolRefSub = undefined;
    }
    if (this.poolSub) {
      this.poolSub.unsubscribe();
      this.poolSub = undefined;
    }
    if (this.poolFireLoopRef) {
      this.poolFireLoopRef.dispose();
      this.poolFireLoopRef = undefined;
    }
    if (this.imageChainSubsn) {
      this.imageChainSubsn.unsubscribe();
      this.imageChainSubsn = undefined;
    }
  }


  toggleChainFilter($event: any) {
    console.log($event);
  }


  add($event: any) {
    if (!this.poolFireLoopRef) {
      throw new Error("Not initialized!");
    }

    this._do_add(this.phraseGen.createNextPhrase());
  }

  add2() {
    this.newPoolDialogRef = this.dialogSvc.open(NewPoolModalComponent,
      {});
    this.newPoolDialogRef.afterClosed()
      .subscribe((data: string) => { this._do_add(data); });
  }


  private _do_add(next_name: string ) {
    if (! this.poolFireLoopRef) {
      throw Error("No FireLoopRef for Pool");
    }
    let newPool: Pool = Pool.factory({
      name: next_name,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    // No need to dispose of subscrption here?
    this.poolFireLoopRef.create(newPool)
      .subscribe(
        (result: Pool) => { console.log('Success'); },
        (err: any) => { console.error('Failed: ', err);
        });

    console.log(newPool);
  }


  filter($event : any) {
    console.log($event);
  }


  sort($event : any ) {
    console.log($event);
  }
}
