/**
 * Created by jheinnic on 12/25/16.
 */
import {Injectable, NgZone} from "@angular/core";
import {PointMappingConfig} from "./point-mapping-config.service";
import {WordPaintInput} from "./word-paint-input.datamodel";
import {WordPaintTask} from "./word-paint-task.class";
import {
  ServiceEventType, AbstractService, ServiceLifecycleStage
} from "../shared/service-util/service-lifecycle.datamodel";
import {PointMap, Point} from "../shared/canvas-util/point.datamodel";
import {PaintableDirective} from "../shared/canvas-util/paintable.directive";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {Subscription} from "rxjs/Subscription";

// Project [0...(pointCount)] onto [minValue...maxValue] by affine

const neverAny: Observable<any> = Observable.never<any>();

class PointMapBatch
{
  public beginAfterComplete: Observable<any>;
  public readonly completeAfterDone: Subject<any>;

  constructor(
    public readonly preparedTask: WordPaintTask,
    public readonly index: number,
    public readonly pointMaps: PointMap[]
  ) {
    this.completeAfterDone = new Subject<any>();
  }

  linkToPrevious(previousObservable: Observable<any>): Observable<any> {
    this.beginAfterComplete = previousObservable;

    return this.completeAfterDone.asObservable();
  }

  toString() {
    return `${this.preparedTask.task}, #${this.index}, ${this.pointMaps.length}; cancelled = ${this.preparedTask.cancelled}`; }
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

  public prepareTask(taskInput: WordPaintInput, canvasElement: PaintableDirective) {
    let imageChain = taskInput.chain;
    let paintPhrase = taskInput.phrase;

    let actualBufferSize = findOptimalDivisor(imageChain.pixelCount, this.svcConfig.maxBufferSize);
    let iterationCount = imageChain.pixelCount / actualBufferSize;

    let pointMaps = derivePointMaps(imageChain.widthPoints, imageChain.heightPoints);
    let pointMapBatches = pointMaps.bufferCount<PointMap>(actualBufferSize);

    let preparedTask: WordPaintTask;

    console.log(`${paintPhrase}: ${imageChain.pixelCount} pixels, ${actualBufferSize} bytes, ${iterationCount} iterations`);

    let launchSubject: Subject<any> = new Subject<any>();
    let taskSubscription: Subscription = pointMapBatches
      .delayWhen<PointMap[]>(
        (item: PointMap[]) => Observable.of(item),
        launchSubject.asObservable())
      .map<PointMap[], PointMapBatch>(
        (subset: PointMap[], index: number) => new PointMapBatch(preparedTask, index, subset))
      .scan(
        (lastCompleteAfter: [PointMapBatch,Observable<any>], nextBatch: PointMapBatch) => {
          return [nextBatch, nextBatch.linkToPrevious(lastCompleteAfter[1])];
        },
        [undefined, new BehaviorSubject<any>(null).asObservable()])
      .take(iterationCount)
      .map((pair:[PointMapBatch,Observable<any>]) => pair[0])
      .filter((batch: PointMapBatch) => batch.preparedTask.cancelled === false)
      .delayWhen((nextBatch: PointMapBatch) => nextBatch.beginAfterComplete)
      .delay(this.svcConfig.liveDelayDuration)
      .subscribe((batch: PointMapBatch) => {
        if (batch.pointMaps) {
          this.ngZone.runOutsideAngular(() => {
            setTimeout(() => {
              batch.preparedTask.doStep(batch.pointMaps, (batch.index + 1) / iterationCount);

              if (batch.completeAfterDone) {
                batch.completeAfterDone.complete();
              }
            }, 0)
          });
        }
      });

    return new WordPaintTask(
      taskInput, this.ngZone, taskSubscription, launchSubject, canvasElement);
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

function derivePointMaps(widthPoints: number[], heightPoints: number[]): Observable<PointMap> {
  return Observable.from<number>(widthPoints)
    .flatMap<number, [Point, Point]>((xVal: number, xIdx: number) => {
      return Observable.from<number>(heightPoints)
        .map<number, [Point, Point]>((yVal: number, yIdx: number) => {
          return [
            new Point(undefined, {
              x: xIdx,
              y: yIdx
            }),
            new Point(undefined, {
              x: xVal,
              y: yVal
            })
          ];
        });
    })
    .map<[Point, Point],PointMap>(function (pair: [Point, Point], index: number) {
      return new PointMap(pair[0].withId(index), pair[1]);
    });
}

