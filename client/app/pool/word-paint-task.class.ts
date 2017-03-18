import {NgZone} from "@angular/core";
import {PointMap} from "../shared/canvas-util/point.datamodel";
import {ImageChain} from "../shared/sdk/models/ImageChain";
import {AbstractTask, TaskEvent} from "../shared/service-util/task-lifecycle.datamodel";
import {WordPaintInput} from "./word-paint-input.datamodel";
import {WordPaintProgress} from "./word-paint-progress.datamodel";
import {WordPaintResult} from "./word-paint-result.datamodel";
import {ReflectiveFluentBuilder, FluentBuilder} from "../../../common/lib/datamodel-ts";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import builder = require("fluent-interface-builder");
import * as randomArtFactory from "./genjs";
import {PaintableDirective} from "../shared/canvas-util/paintable.directive";


export class WordPaintTask extends AbstractTask<WordPaintInput,WordPaintProgress,WordPaintResult>
{
  private isCancelled: boolean = false;
  private model: any;

  constructor(
    readonly input: WordPaintInput, readonly ngZone: NgZone, readonly subscription: Subscription,
    readonly launchSubject: Subject<any>, readonly paintableCanvas: PaintableDirective
  ) {
    super(input);
    this.model = randomArtFactory.new_picture(input.phrase);
  }

  public get phrase(): string {
    return this.task.phrase;
  }

  public get events(): Observable<TaskEvent<WordPaintInput,WordPaintProgress,WordPaintResult>> {
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
    console.log("Inside doStep() for stepContents");
    let paintablePoints = stepContents
      .map((pointMap: PointMap) => pointMap.from.withFillStyle(randomArtFactory.compute_pixel(this.model, pointMap.to.x, pointMap.to.y, 1, 1)));

    console.log("Pre-ngZone, ", this);
    this.ngZone.run(() => {
      console.log('Back in angular zone');
      super.report(WordPaintProgress.build((builder: ReflectiveFluentBuilder<WordPaintProgress>) => {
        builder.pctDone(pctDone)
          .paintPoints(paintablePoints)
      }));

      if ((pctDone === 1) && (! this.isCancelled)) {
        let subscription = this.paintableCanvas.blob.subscribe(
          (blob:Blob) => {
            if (! this.isCancelled) {
              super.finish(WordPaintResult.build((builder: FluentBuilder<WordPaintResult>) => {
                builder.imageData(blob)
              }));
            }

            subscription.unsubscribe();
          },
          (err:any) =>
          {
            console.error(err);
            subscription.unsubscribe();
          },
          () => { subscription.unsubscribe() }
        );
      }
    });
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

