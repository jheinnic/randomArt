/**
 * Created by jheinnic on 12/25/16.
 */
import {Injectable, NgZone} from "@angular/core";
import {Point, PointMap, PaintablePoint} from "./point.datamodel";
import {PointMappingConfig} from "./point-mapping-config.service";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import * as randomArtFactory from "./genjs";



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

export type FitOrFillType = 'fit' | 'fill' | 'square';

const DEFAULT_PHRASE_MODEL = randomArtFactory.new_picture('undefined');


@Injectable()
export class PointMappingService
{
  private phraseFeed: Subject<string> = new Subject<string>();

  private _pixelWidth: number = undefined;
  private _pixelHeight: number = undefined;
  private _pixelCount: number = undefined;
  private _fitOrFill: FitOrFillType = undefined;

  // private livenessFeed: BehaviorSubject<Observable<number>> =
  //   new BehaviorSubject(Observable.never());
  // private livenessPulse: Observable<number> =
  //   this.livenessFeed.asObservable().switch();

  private _actualBufSize: number = undefined;
  private _iterationCount: number = undefined;

  private _widthPoints: number[] = undefined;
  private _heightPoints: number[] = undefined;
  private _pointMap: Observable<PointMap> = undefined;

  private _stepSequence: Observable<PaintablePoint[]> = undefined;
  private _progressSequence: Observable<number> = undefined;
  // private _progressSequence: Observable<[PaintablePoint[],number]> = undefined;

  public constructor(
    private readonly ngZone: NgZone, private readonly svcConfig: PointMappingConfig
  ) {
    super();
  }

  // public get seedPhrase(): string {
  //   return this._seedPhrase;
  // }
  //
  // public set seedPhrase(value: string) {
  //   if (value === undefined) {
  //     this.phraseModel = DEFAULT_PHRASE_MODEL;
  //     this._seedPhrase = undefined;
  //   } else if (this._seedPhrase !== value) {
  //     this.phraseModel = randomArtFactory.new_picture(value);
  //     this._seedPhrase = value;
  //   }
  // }

  public get widthPoints(): number[] {
    return this._widthPoints;
  }

  public get heightPoints(): number[] {
    return this._heightPoints;
  }

  public get pointMap(): Observable<PointMap> {
    return this._pointMap;
  }

  public get pixelWidth(): number {
    return this._pixelWidth;
  }

  public get pixelHeight(): number {
    return this._pixelHeight;
  }

  public get pixelCount(): number {
    return this._pixelCount;
  }

  public get getFitOrFill(): FitOrFillType {
    return this._fitOrFill;
  }

  public mapSquareRegion(sideLength: number): void {
    // Precompute the mapping between pixel indices and coordinate positions.
    // this._widthPoints = computeAffinePixelPoints(sideLength, -1, 1);
    // this._heightPoints = computeAffinePixelPoints(sideLength, -1, 1);

    // this._pixelWidth = sideLength;
    // this._pixelHeight = sideLength;
    // this._pixelCount = sideLength * sideLength;
    // this._fitOrFill  = 'square';

    this.deriveRegionFromDimensions(sideLength, sideLength, 'square', 1.0, 1.0);
  }

  public mapRectangularRegion(
    pixelWidth: number, pixelHeight: number, fitOrFill: 'fit' | 'fill' = 'fit'
  ) {
    if (pixelWidth === pixelHeight) {
      this.mapSquareRegion(pixelWidth);
    } else {
      // let x2 = (((pixelWidth > pixelHeight) && (fitOrFill === 'fill')) || ((pixelWidth
      // < pixelHeight) && (fitOrFill === 'fit'))) ? (pixelHeight / pixelWidth) : 1.0;
      // let y2 = (((pixelWidth < pixelHeight) && (fitOrFill === 'fill')) || ((pixelWidth
      // > pixelHeight) && (fitOrFill === 'fit'))) ? (pixelWidth / pixelHeight) : 1.0;
      let xScale = 1.0;
      let yScale = 1.0;

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

      this.deriveRegionFromDimensions(pixelWidth, pixelHeight, fitOrFill, xScale, yScale);
    }
  }

  private deriveRegionFromDimensions(
    pixelWidth: number, pixelHeight: number, fitOrFill: FitOrFillType, xScale: number,
    yScale: number
  ) {
    let newPixelCount = pixelWidth * pixelHeight;

    if (this._pixelCount !== newPixelCount) {
      this._actualBufSize = undefined;
      this._iterationCount = undefined;
      this._progressSequence = undefined;

      this._pixelCount = newPixelCount;
    }

    let newPoints: boolean = false;

    if ((this._pixelWidth !== pixelWidth) || (this._fitOrFill !== fitOrFill)) {
      let toOriginX = -1 * xScale;
      let toWidth = toOriginX + (2 * xScale);

      // Precompute the mapping between pixel indices and coordinate positions.
      this._widthPoints = computeAffinePixelPoints(pixelWidth, toOriginX, toWidth);

      this._pixelWidth = pixelWidth;

      this._stepSequence = undefined;
      newPoints = true;
    }

    if ((this._pixelHeight !== pixelHeight) || (this._fitOrFill !== fitOrFill)) {
      let toOriginY = -1 * yScale;
      let toHeight = toOriginY + (2 * yScale);

      // Precompute the mapping between pixel indices and coordinate positions.
      this._heightPoints = computeAffinePixelPoints(pixelHeight, toOriginY, toHeight);

      this._pixelHeight = pixelHeight;

      this._stepSequence = undefined;
      newPoints = true;
    }

    if (this._fitOrFill !== fitOrFill) {
      this._fitOrFill = fitOrFill;
    }

    if (newPoints) {
      this._pointMap = Observable.from<number,number>(this._widthPoints)
        .flatMap<number, [Point, Point]>((xVal: number, xIdx: number) => {
          return Observable.from<number, number>(this._heightPoints)
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
    this._actualBufSize = findOptimalDivisor(this.pixelCount, this.maxBufSize);
    this._iterationCount = this.pixelCount / this._actualBufSize;

    this._progressSequence = Observable.range(1, this._iterationCount)
      .map(function pctDone(index: number) { return index / this._iterationCount; });
  }

  public get livenessDelayDuration(): number {
    return this.svcConfig.livenessDelayDuration;
  }

  public get maxBufSize(): number {ˇ
    return this.svcConfig.maxBufSize;
  }

  public get actualBufSize(): number {
    if (!this._actualBufSize) {
      this.deriveIteration();
    }

    return this._actualBufSize;
  }

  public get iterationCount(): number {
    if (!this._iterationCount) {
      this.deriveIteration();
    }

    return this._iterationCount;
  }


  public paintPhrase(seedPhrase: string): boolean {
    if (
      ! this.begin(() => { this.phraseFeed.next(seedPhrase); })
    ) {

    }
  }

  protected doBegin(seedPhrase: string) {
  }

  public get stepSequence(): Observable<PaintablePoint[]> {
    if (!this._stepSequence) {
      this.performColorTransform();
    }

    return this._stepSequence;
  }

  public get progressSequence(): Observable<number> {
    if (!this._progressSequence) {
      this.deriveIteration();
    }

    return this._progressSequence;
  }

  /**
   * @param region          A stream of logical coordinate to canvas pixel mappings.
   * @param pixelCount      The number of points contained in region.  Must be accurate or else
   *                        buffer sizes may be chosen incorrectly, leading to infinite looping.
   * @param seedPhrase      A text phrase that will deterministically seed a function mapping
   *                        coordinates in the logical domain to color values.
   * @param maxBufSize      Largest buffer to fill each livenessLatency interval.
   * @param livenessLatency The computation pause duration between filled buffers of size
   *                        integralBufSize.  Implemented since this computation occurs on the
   *                        UI thread and that UI would therefore become unresponsive if this
   *                        work were done all in one loop through all required iterations.
   * @returns {Observable<PaintablePoint>} A stream of canvas coordinate to logial color pairs.
   */
  private performColorTransform() {
    if ((!this.seedPhrase) || (this.seedPhrase.length <= 0)) {
      throw new Error('seed phrase not yet set');
    } else if (!this._pointMap) {
      throw new Error('Pixel map region size is undefined');
    }

    const phraseModel = randomArtFactory.new_picture(this.seedPhrase);
    this.seedPhrase = undefined;
  }

  public onReady() {

// For this to work, the the total pixel count MUST be an even multiple of
// the overall pixel count.  Otherwise, the final buffer never can flush
// and the sequence may repeat from the beginning, attempting to force that to
// happen!
    this.phraseSubscription = this.phraseFeed.asObservable()
      .map((seedPhrase: string) => {
        return randomArtFactory.new_picture(this.seedPhrase);
      })
      .subscribe((seedPhrase: string) => {
        this._stepSequence = this._pointMap
          .bufferCount(this._actualBufSize)
          .repeatWhen()
          .zip(this.livenessPulse)
          .map<[PointMap[], number],PaintablePoint[]>(function (pointMapsPair: [PointMap[], number]) {
            return pointMapsPair[0]
              .filter(function (pointMap: PointMap) {
                return typeof pointMap === 'object';
              })
              .map(function (pointMap: PointMap) {
                return pointMap.from.withFillStyle(randomArtFactory.compute_pixel(phraseModel, pointMap.to.x, pointMap.to.y, 1, 1));
              });
          });
      });
  }

}
