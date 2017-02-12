import {Director, FactoryWrapper, Partial, Pick, PartialPick} from "../../../common/lib/datamodel-ts";
import {AbstractTask, TaskEventType} from "../shared/service-util/task-lifecycle.datamodel";
import * as randomArtFactory from "./genjs";
import builder = require("fluent-interface-builder");
import {Builder} from "fluent-interface-builder";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {ImageChainDef} from "./image-chain-def.datamodel";
import {PointMap} from "../shared/canvas-util/point.datamodel";
import {NgZone} from "@angular/core";
import {PaintProgress} from "./point-mapping.service";


//
// Wrapper Implementations
//

type WordPaintTaskFactory = FactoryWrapper<WordPaintTask,WordPaintTaskBuilder>;

const wrapWordPaintTask: Builder<WordPaintTaskFactory,Partial<WordPaintTask>> =
  builder.build<WordPaintTaskFactory,Partial<WordPaintTask>>()
    .chain("chain", (chain: ImageChainDef) => (context: Partial<WordPaintTask>) => {
      return Object.assign(context, {chain: chain});
    })
    .chain("phrase", (phrase: string) => (context: Partial<WordPaintTask>) => {
      return Object.assign(context, {phrase: phrase});
    })
    .chain("delayInterval", (delayInterval: number) => (context: Partial<WordPaintTask>) => {
      return Object.assign(context, {delayInterval: delayInterval});
    })
    .chain("maxBufferSize", (maxBufferSize: number) => (context: Partial<WordPaintTask>) => {
      return Object.assign(context, {maxBufferSize: maxBufferSize});
    })
    .chain("ngZone", (ngZone: NgZone) => (context: Partial<WordPaintTask>) => {
      return Object.assign(context, {ngZone: ngZone});
    })
    .chain("subscription", (subscription: Subscription) => (context: Partial<WordPaintTask>) => {
      return Object.assign(context, {subscription: subscription});
    })
    .chain("launchSubject", (launchSubject: Subject<any>) => (context: Partial<WordPaintTask>) => {
      return Object.assign(context, {launchSubject: launchSubject});
    })
    .unwrap("unwrap", () => (context:Partial<WordPaintTask>) => {
      return new WordPaintTask(context.phrase, {
        chain: context.chain,
        model: context.model ? context.model : randomArtFactory.new_picture(context.phrase),
        delayInterval: context.delayInterval,
        maxBufferSize: context.maxBufferSize,
        ngZone: context.ngZone,
        subscription: context.subscription,
        launchSubject: context.launchSubject});
    });


//
// Models
//

type Required = "chain" | "model" | "ngZone" | "launchSubject" | "subscription";

export class WordPaintTask extends AbstractTask<string,PaintProgress,string>
{
  readonly model: any;
  readonly chain: ImageChainDef;
  readonly ngZone: NgZone;
  readonly delayInterval: number;
  readonly maxBufferSize: number;
  readonly subscription: Subscription;
  readonly launchSubject: Subject<any>;
  private isCancelled: boolean = false;

  constructor(phrase: string, base: PartialPick<WordPaintTask,Required>) {
    super(phrase);
    Object.assign(this, base);
  }

  static build(director: Director<WordPaintTaskBuilder>) {
    let wrapper = wrapWordPaintTask.value({});
    director(wrapper);
    return wrapper.unwrap();
  }

  public get phrase(): string {
    return this.task;
  }

  public get events(): Observable<TaskEventType<string,PaintProgress,string>> {
    return super.getEvents();
  }

  public get cancelled(): boolean {
    return this.isCancelled;
  }

  public begin() {
    this.launchSubject.next();
    super.begin();
  }

  public pause() {
    super.pause();
  }

  public resume() {
    super.resume();
  }

  public cancel() {
    super.cancel();

    this.isCancelled = true;
  }

  public doStep(stepContents: PointMap[], pctDone: number) {
    console.log( "Inside doStep() for stepCountents")
    let paintablePoints = stepContents
      .map((pointMap: PointMap) =>
        pointMap.from.withFillStyle(
          randomArtFactory.compute_pixel(
            this.model,
            pointMap.to.x,
            pointMap.to.y,
            1, 1)));

    console.log("Pre-ngZone, ", this);
    this.ngZone.run(() => {
      console.log('Back in angular zone');
      super.report(
        new PaintProgress(paintablePoints, pctDone));

      if (pctDone === 1) {
        super.finish(this.phrase);
      }
    })
  }

  public retry() {
    super.retry();
    this.isCancelled = false;
    this.begin();
  }

  public acknowledge() {
    super.acknowledge();

    this.subscription.unsubscribe();
  }
}


//
// Builder Interfaces
//

export interface WordPaintTaskBuilder
{
  phrase(phrase: string): this;
  model(model: any): this;
  chain(chain: ImageChainDef): this;
  delayInterval(delayInterval: number): this;
  maxBufferSize(maxBufferSize: number): this;
  ngZone(ngZone: NgZone): this;
  launchSubject(launchSubject: Subject<any>): this;
  subscription(subscription: Subscription): this;
}
