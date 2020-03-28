/**
 * Created by jheinnic on 1/28/17.
 */
import builder = require('fluent-interface-builder');
import {
  FactoryWrapper, Partial, buildMethodFactory, Director
} from "../../../common/lib/datamodel-ts";
import {Observable} from "rxjs/Observable";
import {Point, PointMap, PaintablePoint} from "../shared/canvas-util/point.datamodel";
import {Subject, BehaviorSubject, Subscription} from "rxjs";
import {ImageChainDef} from "./local-image.datamodel";
import {Builder} from "fluent-interface-builder";
import * as randomArtFactory from "./genjs";
import {
  ServiceLifecycleStage, ServiceStage
} from "../shared/service-util/worker-lifecycle.datamodel";
import {WordPaintTask} from "../shared/phrase-generator/word-paint-task.datamodel";

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

    // console.log(lowLowHigh, minHighHigh, highLowHigh, altHighLowHigh);

    if (lowLowHigh > highLowHigh) {
      highLowHigh = lowLowHigh;
    }

    return highLowHigh
  }
}


// Project [0...(pointCount)] onto [minValue...maxValue] by affine
// matrix transformation in such a way that the set is symetrically
// balanced (e.g. same distance between any consecutive points and
// the distance between either max or min and the center point are
// identitcal.
//
// To do this, consider the symetrial set of pointCount+1 items,
// and enumerate the values at the midpoint between any two points.
function computeAffinePixelPoints(pointCount: number, minValue: number, maxValue: number) {
  // console.log(`Calculating map from [0...${pointCount}-1] onto [${minValue}...${maxValue}]`)
  let initial = 0.5;
  let translate = minValue;
  let scale = (maxValue - minValue) / (pointCount - 0);

  let pointsArray = [];
  for (let ii = initial; ii < pointCount; ii += 1) {
    pointsArray.push((ii * scale) + translate);
  }
  return pointsArray;
}

function mergePointArrays(widthPoints: number[], heightPoints: number[]) {
  return Observable.from<number>(widthPoints)
    .flatMap<number, [Point, Point]>((xVal: number, xIdx: number) => {
      return Observable.from<number>(heightPoints)
        .map<number, [Point, Point]>((yVal: number, yIdx: number) => {
          return [
            new Point(undefined, {
              x: xIdx,
              y: yIdx
            }), new Point(undefined, {
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

function derivePointMaps(imageChain: ImageChainDef) {
  let xScale = 1.0;
  let yScale = 1.0;

  if (imageChain.pixelWidth === imageChain.pixelHeight) {
    if (imageChain.fitOrFill !== 'square') {
      throw new Error("fitOrFill must be square if width === height");
    }
  } else if (imageChain.fitOrFill === 'square') {
    throw new Error("fitOrFill cannot be square unless width === height");
  } else if (imageChain.pixelWidth > imageChain.pixelHeight) {
    if (imageChain.fitOrFill === 'fill') {
      xScale = imageChain.pixelWidth / imageChain.pixelHeight;
    } else {
      yScale = imageChain.pixelHeight / imageChain.pixelWidth;
    }
  } else if (imageChain.fitOrFill === 'fill') {
    yScale = imageChain.pixelHeight / imageChain.pixelWidth;
  } else {
    xScale = imageChain.pixelWidth / imageChain.pixelHeight;
  }

  let widthPoints = computeAffinePixelPoints(imageChain.pixelWidth, -1 * xScale, xScale);
  let heightPoints = computeAffinePixelPoints(imageChain.pixelHeight, -1 * yScale, yScale);
  return mergePointArrays(widthPoints, heightPoints)
}

export type FitOrFill = 'fit' | 'fill' | 'square';

export interface CreateImagesActivityModelBuilder
{
  reset(): this;
  dimensions(width: number, height: number, fitOrFill: FitOrFill): this;
  maxBufferSize(maxBufferSize: number): this;
  liveDelayDuration(liveDelayInterval: number): this;
  ready(): this;
  paint(phrase: string): this;
  pause(): this;
  resume(): this;
  cancel(): this;
  ackDone(phrase: string): this;
}
export type CreateImagesActivityWrapper =
  FactoryWrapper<CreateImagesActivity, CreateImagesActivityModelBuilder>;

class PointMapBatch {
  constructor(public readonly phraseModel: Object, public readonly pointMaps: PointMap[]) { }
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

const wrapCreateImagesActivity: Builder<CreateImagesActivityWrapper, CreateImagesActivity> =
  builder.build<CreateImagesActivityWrapper, CreateImagesActivity>()
  .chain('reset', () => (context: CreateImagesActivity) => {
    let retVal: CreateImagesActivity = context;

    switch(context.stage) {
      case ServiceStage.killed:
      case STATE.CANCELLED:
      case STATE.FINISHED:
      case STATE.MAY_RETRY:
      case STATE.FAILED:
      case STATE.EXCEPTION:
        context.cancelSubscription.unsubscribe();
        context.cancelationFlag.next(false);
        context.liveDelayFeed.next(Observable.never())
        context.paintPhraseFeed.next(Observable.never())
        retVal = new CreateImagesActivity(context, {
          stage: ServiceStage.offline,
          currentTask: undefined,
          cancelSubscription: undefined
        });
        setTimeout(() => {
          context.onReset.next()
        }, 0);
        break;
      case ServiceStage.offline:
        break;
      default:
        throw new Error("Illegal transition.  Expected not ACTIVE or PAUSED; found "
          + context.stage);
    }

    return retVal;
  })
  .chain('dimensions', (
    pixelWidth: number, pixelHeight: number, fitOrFill: FitOrFill = 'fit'
  ) => (context: CreateImagesActivity) => {
    let retVal: CreateImagesActivity = context;

    switch (context.stage) {
      case ServiceStage.offline:
        if ((context.pixelWidth !== pixelWidth) || (context.pixelHeight !== pixelHeight) || (
            (pixelWidth !== pixelHeight) && (context.fitOrFill !== fitOrFill)
          )) {
          let xScale = 1.0;
          let yScale = 1.0;
          let deltas: Partial<CreateImagesActivity> = {};

          if (pixelWidth === pixelHeight) {
            Object.assign(deltas, {fitOrFill: 'square'});
          } else if (fitOrFill === 'square') {
            throw new Error("fitOrFill cannot be square unless width === height");
          } else {
            Object.assign(deltas, {fitOrFill: fitOrFill});
            if (pixelWidth > pixelHeight) {
              if (fitOrFill === 'fill') {
                xScale = pixelWidth / pixelHeight;
              } else {
                yScale = pixelHeight / pixelWidth;
              }
            } else if (fitOrFill === 'fill') {
              yScale = pixelHeight / pixelWidth;
            } else {
              xScale = pixelWidth / pixelHeight;
            }
          }

          let newPixelCount = pixelWidth * pixelHeight;

          if (context.pixelCount !== newPixelCount) {
            Object.assign(deltas, {
              actualBufferSize: undefined,
              iterationCount: undefined,
              progressSequence: undefined,
              pixelCount: newPixelCount
            });
          }

          let widthPoints = computeAffinePixelPoints(pixelWidth, -1 * xScale, xScale);
          let heightPoints = computeAffinePixelPoints(pixelHeight, -1 * yScale, yScale);

          Object.assign(deltas, {
            widthPoints: widthPoints,
            heightPoints: heightPoints,
            pointMap: derivePointMaps(widthPoints, heightPoints)
          });

          retVal = new CreateImagesActivity(context, deltas);
        }
        break;
      default:
        throw new Error("Illegal transition.  Expected BOOTSTRAP, found " + context.stage);
    }

    return retVal;
  })
  .chain('maxBufferSize', (maxBufferSize: number) => (context: CreateImagesActivity) => {
    switch(context.stage) {
      case ServiceStage.offline:
        return new CreateImagesActivity(context, {
          maxBufferSize: maxBufferSize,
          actualBufferSize: undefined,
          iterationCount: undefined,
        });
      default:
        throw new Error("Illegal transition.  Expected BOOTSTRAP, found " + context.stage);
    }
  })
  .chain('liveDelayDuration', (liveDelayDuration: number) => (context: CreateImagesActivity) => {
    switch(context.stage) {
      case ServiceStage.offline:
        return new CreateImagesActivity(context, {liveDelayDuration: liveDelayDuration});
      default:
        throw new Error("Illegal transition.  Expected BOOTSTRAP, found " + context.stage);
    }
  })
  .unwrap('ready', () => (context: CreateImagesActivity) => {
    switch (context.stage) {
      case ServiceStage.offline:
        let retVal: CreateImagesActivity;
        let iterationCount: number;
        let actualBufferSize: number;

        if ((context.actualBufferSize === undefined) || (context.iterationCount === undefined)) {
          actualBufferSize = findOptimalDivisor(context.pixelCount, context.maxBufferSize);
          iterationCount = context.pixelCount / actualBufferSize;
        } else {
          actualBufferSize = context.actualBufferSize;
          iterationCount = context.iterationCount;
        }

        // Setup cancelation option
        let isCancel: boolean = false;
        let cancelSubscription = context.cancelationFlag.subscribe(
          (value: boolean) => { isCancel = value; });
        let resultSource: Observable<PaintProgress> = context.paintPhraseFeed
          .asObservable()
          .switch()
          .map((paintTask: WordPaintTask) => {
            let phraseModel = randomArtFactory.new_picture(paintTask.phrase);
            return context.pointMap
              .bufferCount<PointMap>(context.actualBufferSize)
              .map<PointMap[], PointMapBatch>(
                (batch: PointMap[]) => new PointMapBatch(phraseModel, batch));
          })
          .concatMap((item) => item)
          .filter(() => !isCancel)
          .finally(() => { context.cancelationFlag.next(false); })
          .zip(context.liveDelayFeed.asObservable()
            .switch())
          .map<[PointMapBatch, any], PaintProgress>(
            (pointMapsPair: [PointMapBatch, any], index: number) => {
              let paintablePoints = pointMapsPair[0].pointMaps
                .map((pointMap: PointMap) => pointMap.from.withFillStyle(
                  randomArtFactory.compute_pixel(
                    pointMapsPair[0].phraseModel,
                    pointMap.to.x, pointMap.to.y,
                    1, 1)));
              let pctDone: number = (index + 1) / iterationCount;

              return new PaintProgress(paintablePoints, pctDone);
            }
          );

        context.liveDelayFeed.next(
          resultSource.delay(context.liveDelayDuration));

        context.paintPhraseFeed.next(
          context.paintPhraseSubject.asObservable());

        return new CreateImagesActivity(context, {
          actualBufferSize: actualBufferSize,
          iterationCount: iterationCount,
          resultSource: resultSource,
          cancelSubscription: cancelSubscription
        });
      default:
        throw new Error("Illegal transition.  Expected BOOTSTRAP, found " + context.stage);
    }
  });
/*
    .chain('paint', (phrase: string) => (context: CreateImagesActivity) => {
      let retVal = context;

      return retVal;
  })
    .chain('pause', () => (context: CreateImagesActivity) => {
      let retVal = context;

      return retVal;
  })
    .chain('resume', () => (context: CreateImagesActivity) => {
      let retVal = context;

      return retVal;
  })
    .chain('cancel', () => (context: CreateImagesActivity) => {
      let retVal = context;

      return retVal;
    })
    .chain('sendAck', (phrase: string) => (context: CreateImagesActivity) => {
      let retVal = context;

      return retVal;
    })
    .unwrap('unwrap', unwrapHelper);
*/


//
// Models
//
const defaultWidth = 360;
const defaultHeight = 240;
const defaultScale = defaultHeight / defaultWidth;
const defaultLiveDelayDuration = 250;
const defaultPixelCount = defaultWidth * defaultHeight;
const defaultWidthPoints =
  computeAffinePixelPoints(defaultWidth, -1, 1);
const defaultHeightPoints =
  computeAffinePixelPoints(defaultHeight, -1 * defaultScale, defaultScale);
const defaultPointMap = derivePointMaps(defaultWidthPoints, defaultHeightPoints);
const defaultMaxBufferSize = 1536;
const defaultActualBufferSize =
  findOptimalDivisor(defaultPixelCount, defaultMaxBufferSize);
const defaultIterCount = defaultPixelCount / defaultActualBufferSize;

const neverAny = Observable.never<any>();

export class CreateImagesActivity
{
  public readonly stage: ServiceLifecycleStage;

  /*
  public readonly imageChain: ImageChainDef;
  public readonly widthPoints: number[];
  public readonly heightPoints: number[];
  public readonly pointMap: Observable<PointMap>;
  */

  public readonly maxBufferSize: number;
  public readonly liveDelayDuration: number;
  public readonly liveDelayFeed: BehaviorSubject<Observable<any>>;

  public readonly actualBufferSize: number;
  public readonly iterationCount: number;

  public readonly paintPhraseSubject: Subject<WordPaintTask>;
  public readonly paintPhraseFeed: BehaviorSubject<Observable<WordPaintTask>>;

  public readonly cancelSubscription: Subscription;
  public readonly cancelationFlag: BehaviorSubject<boolean>;
  public readonly resultSource: Observable<PaintProgress>;

  public readonly onReady: Subject<void>;
  public readonly onBegin: Subject<string>;
  public readonly onFinished: Subject<void>;
  public readonly onCancel: Subject<void>;
  public readonly onPause: Subject<void>;
  public readonly onResume: Subject<void>;
  public readonly onReset: Subject<void>;

  constructor(predecessor?: CreateImagesActivity, data?: Partial<CreateImagesActivity>) {
    if (predecessor) {
      Object.assign(this, predecessor, data || {});
    } else {
      this.stage = ServiceStage.offline;
      this.maxBufferSize = defaultMaxBufferSize;
      this.liveDelayDuration = defaultLiveDelayDuration;
      // this.widthPoints = defaultWidthPoints;
      // this.heightPoints = defaultHeightPoints;
      // this.pointMap = defaultPointMap;
      this.actualBufferSize = defaultActualBufferSize;
      this.iterationCount = defaultIterCount;
      this.cancelationFlag = new BehaviorSubject<boolean>(false);
      this.paintPhraseSubject = new Subject<WordPaintTask>();
      this.paintPhraseFeed = new BehaviorSubject<Observable<WordPaintTask>>(neverAny);
      this.liveDelayFeed = new BehaviorSubject<Observable<any>>(neverAny);

      this.onReady = new Subject<void>();
      this.onBegin = new Subject<string>();
      this.onFinished = new Subject<void>();
      this.onCancel = new Subject<void>();
      this.onPause = new Subject<void>();
      this.onResume = new Subject<void>();
      this.onReset = new Subject<void>();

      if (data) {
        Object.assign(this, data);
      }
    }
  }

  static build = buildMethodFactory(wrapCreateImagesActivity, CreateImagesActivity);

  // copy = copyMethodFactory(wrapCreateImagesActivity);
  copy(director: Director<CreateImagesActivityModelBuilder>) {
    let wrapper = wrapCreateImagesActivity.value(this);
    director(wrapper);
    return wrapper.unwrap();
  }
}

