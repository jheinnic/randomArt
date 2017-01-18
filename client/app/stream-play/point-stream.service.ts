/**
 * Created by jheinnic on 12/25/16.
 */
import {Injectable} from "@angular/core";
import {Point, PointMap, PaintablePoint} from "./point.datamodel";
import {Observable} from "rxjs/Observable";
import * as randomArtFactory from "./genjs";

function computePixelPoints(pointCount, minValue, maxValue) {
  var initial: number;
  if ((pointCount % 2) == 0) {
    initial = 0.5;
  } else {
    initial = 0;
  }

  const rangeWidth: number = 1.0 * (maxValue - minValue);
  const halfWidth: number = rangeWidth / 2.0;
  const midOffset: number = minValue * (-1.0);  // maxValue - rangeWidth;

  let pointsArray = [];
  for (let ii = initial; ii < pointCount; ii += 1) {
    pointsArray.push((rangeWidth * ii / pointCount) + midOffset);
  }
  return pointsArray;
}

// Project [0...(pointCount)] onto [minValue...maxValue] by affine
// matrix transformation in such a way that the set is symetrically
// balanced (e.g. same distance between any consecutive points and
// the distance between either max or min and the center point are
// identitcal.
//
// To do this, consider the symetrial set of pointCount+1 items,
// and enumerate the values at the midpoint between any two points.

function computeAffinePixelPoints(pointCount, minValue, maxValue) {
  // console.log(`Calculating map from [0...${pointCount}-1] onto [${minValue}...${maxValue}]`)
  var initial = 0.5;
  var translate = minValue;
  var scale = (maxValue - minValue) / (pointCount - 0);

  var pointsArray = [];
  for (var ii = initial; ii < pointCount; ii += 1) {
    pointsArray.push((ii * scale) + translate);
  }
  return pointsArray;
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
        // console.log('a');
        return ii;
      }
    }

    return 1;
  } else {
    let highLowHigh = 0;
    for (ii = sqrt; highLowHigh === 0; ii--) {
      // console.log(ii);
      if ((multiplicand % ii) === 0) {
        highLowHigh = ii;
      }
    }

    let firstFound = true;
    let lowLowHigh = 0;
    for (ii = 2; (ii < highLowHigh) && (lowLowHigh === 0); ii++) {
      // console.log(ii);
      if ((multiplicand % ii) === 0) {
        lowLowHigh = multiplicand / ii;
        if (lowLowHigh > maxDivisor) {
          lowLowHigh = 0;
          firstFound = false;
        }
      }
    }
    if ((lowLowHigh > 0) && firstFound) {
      // console.log('b');
      return lowLowHigh;
    }

    // let minHighHigh = 0;
    let altHighLowHigh = multiplicand / highLowHigh;
    if (altHighLowHigh <= maxDivisor) {
      highLowHigh = altHighLowHigh;
      // minHighHigh = highLowHigh;
      // } else {
      //   minHighHigh = sqrt;
    }

    // console.log(lowLowHigh, minHighHigh, highLowHigh, altHighLowHigh);

    if (lowLowHigh > highLowHigh) {
      highLowHigh = lowLowHigh;
      // minHighHigh = lowLowHigh;
    }

    /*
     var half = Math.floor(multiplicand / 2);
     for(ii=Math.min(half, maxDivisor); ii>minHighHigh; ii--) {
     // console.log(ii);
     if ((multiplicand % ii) === 0) {
     // console.log('c');
     return ii;
     }
     }
     */

    // console.log('d');
    return highLowHigh
  }
}

const oneHundred: number = 100.0;
const tenThousand: number = 10000.0;


@Injectable()
export class PointStreamService
{
  private width: number;
  private height: number;
  private pixelCount: number;
  private widthPoints: number[];
  private heightPoints: number[];

  public constructor() { }

  public mapSquareRegion(pixelCount: number): Observable<PointMap> {
    // Precompute the mapping between pixel indices and coordinate positions.
    this.widthPoints = computeAffinePixelPoints(pixelCount, -1, 1);
    this.heightPoints = computeAffinePixelPoints(pixelCount, -1, 1);
    let counter: number = 0;

    return Observable.from<number,number>(this.widthPoints)
      .flatMap<number, PointMap>((xVal: number, xIdx: number) => {
        return Observable.from<number, number>(this.heightPoints)
          .map<number, PointMap>((yVal: number, yIdx: number) => {
            return new PointMap(
              new Point(counter, xIdx, yIdx),
              new Point(counter++, xVal, yVal)
            );
});
      });
  }

  public streamSlowly(pixelCount: number, interval: number): Observable<PointMap> {
    const intervalSeq: Observable<number> = Observable.interval(interval);
    const itemSeq: Observable<PointMap> = this.mapSquareRegion(pixelCount);

    return intervalSeq.zip<number,PointMap>(itemSeq)
      .map<[number, PointMap],PointMap>(
        function (x: [number, PointMap]) { return x[1]; }
      );
  }

  public mapRectangularRegion(
    pixelWidth: number, pixelHeight: number, fitOrFill: 'fit' | 'fill' = 'fit'
  ) {
    // let x2 = (((pixelWidth > pixelHeight) && (fitOrFill === 'fill')) || ((pixelWidth
    // < pixelHeight) && (fitOrFill === 'fit'))) ? (pixelHeight / pixelWidth) : 1.0;
    // let y2 = (((pixelWidth < pixelHeight) && (fitOrFill === 'fill')) || ((pixelWidth
    // > pixelHeight) && (fitOrFill === 'fit'))) ? (pixelWidth / pixelHeight) : 1.0;
    let x2 = 1.0;
    let y2 = 1.0;
    if (pixelWidth > pixelHeight) {
      if (fitOrFill === 'fill') {
        x2 = pixelWidth / pixelHeight;
      } else {
        y2 = pixelHeight / pixelWidth;
      }
    } else if (fitOrFill === 'fill') {
      y2 = pixelHeight / pixelWidth;
    } else {
      x2 = pixelWidth / pixelHeight;
    }

    let toOriginX = -1 * x2;
    let toOriginY = -1 * y2;
    let toWidth = 2 * x2;
    let toHeight = 2 * y2;

    // Precompute the mapping between pixel indices and coordinate positions.
    this.widthPoints = computeAffinePixelPoints(pixelWidth, toOriginX, toOriginX + toWidth);
    this.heightPoints = computeAffinePixelPoints(pixelHeight, toOriginY, toOriginY + toHeight);
    let counter: number = 0;

    return Observable.from<number,number>(this.widthPoints)
      .flatMap<number, PointMap>((xVal: number, xIdx: number) => {
        return Observable.from<number, number>(this.heightPoints)
          .map<number, PointMap>((yVal: number, yIdx: number) => {
            return new PointMap(
              new Point(counter, xIdx, yIdx),
              new Point(counter++, xVal, yVal));
          });
      });
  }

  public performColorTransform(
    region: Observable<PointMap>, seedPhrase: string
  ): Observable<PaintablePoint> {
    let phraseModel = randomArtFactory.new_picture(seedPhrase);
    return region.map(function (pointMap: PointMap, index: number) {
      return pointMap.from.withFillStyle(randomArtFactory.compute_pixel(phraseModel, pointMap.to.x, pointMap.to.y, 1, 1))
    });
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
  public performGradualColorTransform(
    region: Observable<PointMap>, pixelCount: number, seedPhrase: string,
    livenessLatency: number = 750, maxBufSize: number = 2000,
  ): Observable<[PaintablePoint[], number]> {
    const phraseModel = randomArtFactory.new_picture(seedPhrase);
    const integralBufSize = findOptimalDivisor(pixelCount, maxBufSize);
    const iterCount = pixelCount / integralBufSize;

    const progressSequence =
      Observable.range(1, iterCount).map(
        function getPercentDone(index: number) { return index / iterCount; }
      );

    // For this to work, the the total pixel count MUST be an even multiple of
    // the overall pixel count.  Otherwise, the final buffer never can flush
    // and the sequence may repeat from the beginning, attempting to force that to
    // happen!
    return region.bufferCount(integralBufSize)
      .zip(Observable.interval(livenessLatency))
      .map<[PointMap[], number],PaintablePoint[]>(function (pointMapsPair: [PointMap[], number]) {
        return pointMapsPair[0]
          .filter(function (pointMap: PointMap) { return typeof pointMap === 'object'; })
          .map(function (pointMap: PointMap) {
            return pointMap.from.withFillStyle(randomArtFactory.compute_pixel(phraseModel, pointMap.to.x, pointMap.to.y, 1, 1));
          });
      }).zip(progressSequence);
  }
}

function gcf(a:number, b:number) {
  let retVal = a;
  if (b !== 0) {
    retVal = gcf(b, a % b);
  }
  return retVal;
}

function listDivisors(n) {
  if (n < 1) {
    throw "Argument error";
  }

  const small = [];
  const large = [];
  const  end = Math.floor(Math.sqrt(n));

  for (let i = 1; i < end; i++) {
    if ((n % i) === 0) {
      small.push(i);
    }
  }

  if ((end*end) === n) {
    small.push(end);
  }

  return small.concat(
    large.reverse());
}

