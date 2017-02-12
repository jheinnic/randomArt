/**
 * Created by jheinnic on 12/25/16.
 */
import {Injectable, NgZone} from "@angular/core";
import {PointMap, PaintablePoint} from "../shared/canvas-util/point.datamodel";
import {PointMappingConfig} from "./point-mapping-config.service";
import {WordPaintTask, WordPaintTaskBuilder} from "./word-paint-task.datamodel";
import {
  ServiceEventType, AbstractService, ServiceLifecycleStage
} from "../shared/service-util/service-lifecycle.datamodel";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {ReplaySubject} from "rxjs/ReplaySubject";

// Project [0...(pointCount)] onto [minValue...maxValue] by affine

const neverAny: Observable<any> = Observable.never<any>();

class PointMapBatch
{
  public beginAfterComplete: Observable<any>;
  public completeAfterDone: Subject<any>;

  constructor(
    public readonly preparedTask: WordPaintTask,
    public readonly index: number,
    public readonly pointMaps: PointMap[]
  ) { }

  toString() {
    return `${this.preparedTask.task}, #${this.index}, ${this.pointMaps.length}; cancelled = ${this.preparedTask.cancelled}`; }
}

/**
 * Encapsulation for a partial set of paintable pixels, giving
 */
export class PaintProgress
{
  constructor(
    public readonly paintPoints: PaintablePoint[], public readonly pctDone: number
  ) { }
}

@Injectable()
export class PointMappingService extends AbstractService
{
  public constructor(
    private readonly ngZone: NgZone, private readonly svcConfig: PointMappingConfig
  ) {
    super();
    this.launch();
  }

  public get stage(): ServiceLifecycleStage {
    return this.getStage();
  }

  public get events(): Observable<ServiceEventType> {
    return this.getEvents();
  }

  public prepareTask(sourceTask: WordPaintTask) {
    let imageChain = sourceTask.chain;
    let paintPhrase = sourceTask.phrase;

    let actualBufferSize = findOptimalDivisor(imageChain.pixelCount, this.svcConfig.maxBufferSize);
    let iterationCount = imageChain.pixelCount / actualBufferSize;
    let pointMapBatches = imageChain.pointMaps.bufferCount<PointMap>(actualBufferSize);

    let preparedTask: WordPaintTask;

    console.log(`${paintPhrase}: ${imageChain.pixelCount} pixels, ${actualBufferSize} bytes, ${iterationCount} iterations`);

    let launchSubject: Subject<any> = new Subject<any>();
    let taskSubscription = pointMapBatches
      .delayWhen(
        (item: PointMap[]) => Observable.of(item),
        launchSubject.asObservable())
      .map<PointMap[], PointMapBatch>(
        (subset: PointMap[], index: number) =>
          new PointMapBatch(preparedTask, index, subset)
      )
      .scan(
        (lastCompleteAfter: [PointMapBatch,Observable<any>], nextBatch: PointMapBatch) => {
          let nextSubject = new ReplaySubject<any>(1);
          let nextCompleteAfter: [PointMapBatch,Observable<any>] =
            [nextBatch, nextSubject.asObservable()];

          nextBatch.beginAfterComplete = lastCompleteAfter[1];
          nextBatch.completeAfterDone = nextSubject;

          return nextCompleteAfter;
        },
        [undefined, new BehaviorSubject<any>(null).asObservable()]
      )
      .map(
        (boxed: [PointMapBatch,Observable<any>]) => boxed[0]
      )
      .take(iterationCount)
      .filter(
        (batch: PointMapBatch) => batch.preparedTask.cancelled === false
      )
      .delayWhen(
        (nextBatch: PointMapBatch) => nextBatch.beginAfterComplete
      )
      .delay(this.svcConfig.liveDelayDuration)
      .subscribe(
        (batch: PointMapBatch) => {
          if (batch.pointMaps) {
            this.ngZone.runOutsideAngular(() => {
              setTimeout(() => {
                batch.preparedTask.doStep(
                  batch.pointMaps,
                  (batch.index + 1) / iterationCount);

                if (batch.completeAfterDone) {
                  batch.completeAfterDone.complete();
                }
              }, 0)
            });
          }
        }
      );

    preparedTask = WordPaintTask.build((builder: WordPaintTaskBuilder) => {
      builder.phrase(paintPhrase)
        .chain(imageChain)
        .ngZone(this.ngZone)
        .launchSubject(launchSubject)
        .subscription(taskSubscription)
    });

    return preparedTask;
  }
}

/**
 * Find the largest possible divisor of multiplicand that no greater than maxDivisor.
 *
 * @param multiplicand
 * @param maxDivisor
 */
function findOptimalDivisor(multiplicand: number, maxDivisor: number) {
  if ((multiplicand % maxDivisor) === 0) {
    return maxDivisor;
  }

  let ii;
  let sqrt = Math.floor(Math.sqrt(multiplicand));
  if (sqrt > maxDivisor) {
    for (ii = maxDivisor; ii > 1; ii--) {
      if ((multiplicand % ii) === 0) {
        return ii;
      }
    }

    return 1;
  } else {
    let highLowHigh = 0;
    for (ii = sqrt; highLowHigh === 0; ii--) {
      if ((multiplicand % ii) === 0) {
        highLowHigh = ii;
      }
    }

    let firstFound = true;
    let lowLowHigh = 0;
    for (ii = 2; (ii < highLowHigh) && (lowLowHigh === 0); ii++) {
      if ((multiplicand % ii) === 0) {
        lowLowHigh = multiplicand / ii;
        if (lowLowHigh > maxDivisor) {
          lowLowHigh = 0;
          firstFound = false;
        }
      }
    }
    if ((lowLowHigh > 0) && firstFound) {
      return lowLowHigh;
    }

    let altHighLowHigh = multiplicand / highLowHigh;
    if (altHighLowHigh <= maxDivisor) {
      highLowHigh = altHighLowHigh;
    }

    if (lowLowHigh > highLowHigh) {
      highLowHigh = lowLowHigh;
    }

    return highLowHigh
  }
}
