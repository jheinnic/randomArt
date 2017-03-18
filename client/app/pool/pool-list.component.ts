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
import Immutable = require('immutable');
import uuid = require('uuid');
import _ = require('lodash');
import {MdDialogRef, MdDialog} from "@angular/material";


const MIN_QUEUE_SIZE: number = 8;
const MAX_BUFFER_SIZE: number = 2000;
const LIVE_LATENCY: number = 600;


@Component({
  moduleId: "client/app/pool/pool-list.component'",
  selector: "pool-list",
  inputs: [],
  template: require("./_pool-list.view.html"),
  styleUrls: ["./_image-lobby.scss"]
})
export class PoolListComponent implements OnDestroy
{
  // private routeSnapshot: ActivatedRouteSnapshot;

  private imageChainSubsn: Subscription;
  private allImageChains: Immutable.List<ImageChain>;

  private poolSub: Subscription;
  private poolRef: FireLoopRef<Pool>;
  private poolList: Immutable.List<Pool>;

  private newPoolDialogRef: MdDialogRef<NewPoolModalComponent>;

  constructor(
    private readonly route: ActivatedRoute, private readonly userApi: UserApi,
    private readonly phraseGen: PhraseGeneratorService, private readonly realTime: RealTime,
    private readonly imageChainCache: ImageChainCacheService, private readonly dialogSvc: MdDialog
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
      this.imageChainSubsn = imageChains.subscribe(
        (chains: ImageChain[]) => {
          this.allImageChains = Immutable.List<ImageChain>(chains);
        },
        (err: any) => {
          console.error(err);
          this.imageChainSubsn.unsubscribe();
        },
        () => { this.imageChainSubsn = undefined; }
      );
    } else {
      this.allImageChains = imageChains;
    }

    this.poolList = Immutable.List<Pool>([]);
    this.poolSub =
      this.realTime.onReady().subscribe(
        (ready: string) => {
          this.poolSub.unsubscribe();

          let fireLoop = this.realTime.FireLoop;
          this.poolRef = fireLoop.ref<Pool>(Pool);
          this.poolSub =
            this.poolRef.on('change', {
              offset: 0,
              where: {
                ownerId: this.userApi.getCurrentId()
              },
              order: "imageChainId ASC, name ASC"
            }).subscribe(
              (pools: Pool[]) => {
                this.poolList = Immutable.List<Pool>(pools);
              },
              (err: any) => {
                console.error(err);
                this.poolSub.unsubscribe();
              },
              () => {this.poolSub = undefined; }
            );
        },
        (err: any) => {
          console.error(err);
          this.poolSub.unsubscribe();
        },
        () => { this.poolSub = undefined; }
      );
  }

  ngOnDestroy() {
    if (this.poolSub) {
      this.poolSub.unsubscribe();
    }
    if (this.poolRef) {
      this.poolRef.dispose();
    }
    if (this.imageChainSubsn) {
      this.imageChainSubsn.unsubscribe();
    }
  }

  toggleChainFilter($event) {
    console.log($event);
  }

  add($event) {
    console.log($event);

    let newPool: Pool = Pool.factory({
      name: this.phraseGen.createNextPhrase(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    this.poolRef.create(newPool).subscribe(
      (result:Pool) => {
        console.log('Success');
      },
      (err:any) => {
        console.error('Failed: ', err);
      }
    );

    console.log(newPool);

    this.newPoolDialogRef = this.dialogSvc.open(NewPoolModalComponent, {});
    this.newPoolDialogRef.afterClosed().subscribe(
      (data: string) => {
        let newPool: Pool = Pool.factory({
          name: data,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        this.poolRef.create(newPool).subscribe(
          (result:Pool) => {
            console.log('Success: ', data);
          },
          (err:any) => {
            console.error('Failed: ', data, err);
          }
        );
      }
    );

    return newPool;
  }

  filter($event) {
    console.log($event);
  }

  sort($event) {
    console.log($event);
  }
}
