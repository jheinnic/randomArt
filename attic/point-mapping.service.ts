/**
 * Created by jheinnic on 12/25/16.
 */
import {Injectable, NgZone} from "@angular/core";
import {PointMap, PaintablePoint} from "../shared/canvas-util/point.datamodel";
import {PointMappingConfig} from "./point-mapping-config.service";
import {Observable} from "rxjs/Observable";
import * as randomArtFactory from "./genjs";
import {
  ServiceLifecycleStage, ServiceEventType
} from "../shared/service-util/worker-lifecycle.datamodel";
import {BehaviorSubject, Subscription, Subject} from "rxjs";
import {AbstractService} from "../shared/service-util/service-lifecycle.datamodel";
import {WordPaintTask} from "../shared/phrase-generator/word-paint-task.datamodel";


// Project [0...(pointCount)] onto [minValue...maxValue] by affine


export type FitOrFillType = 'fit' | 'fill' | 'square';

const neverAny: Observable<any> = Observable.never<any>();

class PointMapBatch {
  constructor(public readonly sourceTask: WordPaintTask, public readonly pointMaps: PointMap[]) { }


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
  // private phraseFeed: Subject<string> = new Subject<string>();
  // private ackFeed: Subject<void> = new Subject<void>();
  // private createImagesActivityModel: CreateImagesActivity;

  public readonly maxBufferSize: number;
  public readonly liveDelayDuration: number;
  public readonly liveDelayFeed: BehaviorSubject<Observable<any>>;

  public readonly actualBufferSize: number;
  public readonly iterationCount: number;

  public readonly paintTaskSubject: Subject<WordPaintTask>;
  public readonly paintTaskFeed: BehaviorSubject<Observable<WordPaintTask>>;

  public readonly cancelSubscription: Subscription;
  public readonly cancelationFlag: BehaviorSubject<boolean>;
  public readonly resultSource: Observable<PaintProgress>;

  // private stepSequence: Observable<PaintProgress> = undefined;
  // private progressSequence: Observable<number> = undefined;
  // private _progressSequence: Observable<[PaintablePoint[],number]> = undefined;

  public constructor(
    private readonly ngZone: NgZone, private readonly svcConfig: PointMappingConfig
  ) {
    super();
    this.launch();
  }


    this.cancelationFlag = new BehaviorSubject<boolean>(false);
    this.paintTaskSubject = new Subject<WordPaintTask>();
    this.paintTaskFeed = new BehaviorSubject<Observable<WordPaintTask>>(neverAny);
    this.liveDelayFeed = new BehaviorSubject<Observable<any>>(neverAny);

    // let iterationCount: number;
    // let actualBufferSize: number;
    //
    // if ((ontext.actualBufferSize === undefined) || (context.iterationCount === undefined)) {
    //   actualBufferSize = findOptimalDivisor(context.pixelCount, context.maxBufferSize);
    //   iterationCount = context.pixelCount / actualBufferSize;
    // } else {
    //   actualBufferSize = context.actualBufferSize;
    //   iterationCount = context.iterationCount;
    // }
    //
    // // Setup cancelation option
    // let isCancel: boolean = false;
    // let cancelSubscription = context.cancelationFlag.subscribe(
    //   (value: boolean) => { isCancel = value; });
    let batchSource: Observable<PointMapBatch> = this.paintTaskFeed
      .asObservable()
      .switch()
      .exhaustMap((paintTask: WordPaintTask) => {
        let actualBufferSize =
          findOptimalDivisor(paintTask.chain.pixelCount, this.svcConfig.maxBufferSize);
        let iterationCount = paintTask.chain.pixelCount / actualBufferSize;

        return paintTask.chain.pointMaps
          .bufferCount<PointMap>(actualBufferSize)
          .map<PointMap[], PointMapBatch>(
            (subset: PointMap[]) => new PointMapBatch(paintTask, subset));
      })
      .filter((batch: PointMapBatch) => (batch.sourceTask.cancelled === false));

    this.resultSource = batchSource
      .zip(this.liveDelayFeed.asObservable()
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

    this.liveDelayFeed.next(
      batchSource.delay(this.liveDelayDuration));

    this.paintTaskFeed.next(
      this.paintTaskSubject.asObservable());

    // return new CreateImagesActivity(this, {
    //   actualBufferSize: actualBufferSize,
    //   iterationCount: iterationCount,
    //   resultSource: resultSource,
    //   cancelSubscription: cancelSubscription
    // });
  }

  // public get seedPhrase(): string {
  //   return this.seedPhrase;
  // }
  //
  // public set seedPhrase(value: string) {
  //   if (value === undefined) {
  //     this.phraseModel = DEFAULT_PHRASE_MODEL;
  //     this.seedPhrase = undefined;
  //   } else if (this.seedPhrase !== value) {
  //     this.phraseModel = randomArtFactory.new_picture(value);
  //     this.seedPhrase = value;
  //   }
  // }

  public get widthPoints(): number[] {
    return this.currentState.widthPoints;
  }

  public get heightPoints(): number[] {
    return this.currentState.heightPoints;
  }

  public get pointMap(): Observable<PointMap> {
    return this.currentState.pointMap;
  }

  public get pixelWidth(): number {
    return this.currentState.pixelWidth;
  }

  public get pixelHeight(): number {
    return this.currentState.pixelHeight;
  }

  public get pixelCount(): number {
    return this.currentState.pixelCount;
  }

  public get fitOrFill(): FitOrFillType {
    return this.currentState.fitOrFill;
  }

  public get livenessDelayDuration(): number {
    return this.svcConfig.livenessDelayDuration;
  }

  public get maxBufSize(): number {
    return this.svcConfig.maxBufSize;
  }

  // public get actualBufSize(): number {
  //   if (!this.actualBufSize) {
  //     this.deriveIteration();
  //   }
  //
  //   return this.actualBufSize;
  // }
  //
  // public get iterationCount(): number {
  //   if (!this.iterationCount) {
  //     this.deriveIteration();
  //   }
  //
  //   return this.iterationCount;
  // }


  public initImageChain(imageChain: ImageChainDef) {
    this.currentState = this.currentState.copy(
      (builder: CreateImagesActivityModelBuilder) => {
        builder.dimensions(
          imageChain.pixelWidth, imageChain.pixelHeight, imageChain.fitOrFill
        ).ready();
      }
    );
  }

  public paintTask(seedPhrase: string) {
    this.currentState = this.currentState.copy(
      (builder: CreateImagesActivityModelBuilder) => {
        builder.paint(seedPhrase);
      }
    );
  }

  public

  public get onProgress(): Observable<PaintProgress> {
    return this.currentState.resultSource
  }

  public get onBegin(): Observable<string> {
    return this.currentState.onBegin;
  }

  public get onReady(): Observable<void> {
    return this.currentState.onReady;
  }

  public get onPause(): Observable<void> {
    return this.currentState.onPause;
  }

  public get onResume(): Observable<void> {
    return this.currentState.onResume;
  }

  public get onCancel(): Observable<void> {
    return this.currentState.onCancel;
  }

  public get onFinished(): Observable<void> {
    return this.currentState.onFinished;
  }

  public get onReset(): Observable<void> {
    return this.currentState.onReset;
  }
}

/*
// Precompute the mapping between pixel indices and coordinate positions.
public mapSquareRegion(sideLength: number): void {
  if ( (this.currentState === undefined) ||
    (this.currentState.pixelWidth !== sideLength) ||
    (this.currentState.pixelHeight !== sideLength) ||
    (this.currentState.fitOrFill !== 'square')) {
    this.currentState = this.currentState.copy( (builder:CreateImagesActivityModelBuilder) => {
      builder.dimensions(sideLength, sideLength, 'square');
    });
  }

  // this.deriveRegionFromDimensions(sideLength, sideLength, 'square', 1.0, 1.0);
  this.deriveIteration();
}

public mapRectangularRegion(
  pixelWidth: number, pixelHeight: number, fitOrFill: 'fit' | 'fill' = 'fit'
) {
  if (pixelWidth === pixelHeight) {
    this.mapSquareRegion(pixelWidth);
  } else {
    if ( (this.currentState === undefined) ||
      (this.pixelWidth !== pixelWidth) ||
      (this.pixelHeight !== pixelHeight) ||
      (this.fitOrFill !== fitOrFill)) {
      this.createImagesActivityModel = CreateImagesActivity.build( (builder:CreateImagesActivityModelBuilder) => {
        builder.dimensions(pixelWidth, pixelHeight, fitOrFill);
      });
      this.currentState = this.createImagesActivityModel.canvasRegion;
    }

    // let x2 = (((pixelWidth > pixelHeight) && (fitOrFill === 'fill')) || ((pixelWidth
    // < pixelHeight) && (fitOrFill === 'fit'))) ? (pixelHeight / pixelWidth) : 1.0;
    // let y2 = (((pixelWidth < pixelHeight) && (fitOrFill === 'fill')) || ((pixelWidth
    // > pixelHeight) && (fitOrFill === 'fit'))) ? (pixelWidth / pixelHeight) : 1.0;
    // let xScale = 1.0;
    // let yScale = 1.0;
    //
    // if (pixelWidth > pixelHeight) {
    //   if (fitOrFill === 'fill') {
    //     xScale = pixelWidth / pixelHeight;
    //   } else {
    //     yScale = pixelHeight / pixelWidth;
    //   }
    // } else if (fitOrFill === 'fill') {
    //   yScale = pixelHeight / pixelWidth;
    // } else {
    //   xScale = pixelWidth / pixelHeight;
    // }

    // this.deriveRegionFromDimensions(pixelWidth, pixelHeight, fitOrFill, xScale, yScale);
    this.deriveIteration();
  }
}

private deriveRegionFromDimensions(
  pixelWidth: number, pixelHeight: number, fitOrFill: FitOrFillType, xScale: number,
  yScale: number
) {
  let newPixelCount = pixelWidth * pixelHeight;

  if (this.pixelCount !== newPixelCount) {
    this.actualBufSize = undefined;
    this.iterationCount = undefined;
    this.progressSequence = undefined;

    this.pixelCount = newPixelCount;
  }

  let newPoints: boolean = false;

  if ((this.pixelWidth !== pixelWidth) || (this.fitOrFill !== fitOrFill)) {
    let toOriginX = -1 * xScale;
    let toWidth = toOriginX + (2 * xScale);

    // Precompute the mapping between pixel indices and coordinate positions.
    this.widthPoints = computeAffinePixelPoints(pixelWidth, toOriginX, toWidth);

    this.pixelWidth = pixelWidth;

    this.stepSequence = undefined;
    newPoints = true;
  }

  if ((this.pixelHeight !== pixelHeight) || (this.fitOrFill !== fitOrFill)) {
    let toOriginY = -1 * yScale;
    let toHeight = toOriginY + (2 * yScale);

    // Precompute the mapping between pixel indices and coordinate positions.
    this.heightPoints = computeAffinePixelPoints(pixelHeight, toOriginY, toHeight);

    this.pixelHeight = pixelHeight;

    this.stepSequence = undefined;
    newPoints = true;
  }

  if (this.fitOrFill !== fitOrFill) {
    this.fitOrFill = fitOrFill;
  }

  if (newPoints) {
    this.pointMap = Observable.from<number,number>(this.widthPoints)
      .flatMap<number, [Point, Point]>((xVal: number, xIdx: number) => {
        return Observable.from<number, number>(this.heightPoints)
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
}

private deriveIteration() {
  this.actualBufSize = findOptimalDivisor(this.pixelCount, this.maxBufSize);
  this.iterationCount = this.pixelCount / this.actualBufSize;

  this.progressSequence = Observable.range(1, this.iterationCount)
    .map(function pctDone(index: number) { return index / this.iterationCount; });
}
 */

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
