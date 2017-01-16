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
            const id = counter++;
            return new PointMap(new Point(id, xIdx, yIdx), new Point(id, xVal, yVal));
          });
      });
  }

  public streamSlowly(pixelCount: number, interval: number): Observable<PointMap> {
    const interval$: Observable<number> = Observable.interval(interval);
    const items$: Observable<PointMap> = this.mapSquareRegion(pixelCount);

    return interval$.zip<number,PointMap>(items$)
      .map<[number, PointMap],PointMap>(function (
        x: [number, PointMap], index: number
      ) { return x[1]; });
  }

  public mapRectangularRegion(
    pixelWidth: number, pixelHeight: number, toOriginX: number, toOriginY: number,
    toWidth: number, toHeight: number
  ) {
    // Precompute the mapping between pixel indices and coordinate positions.
    this.widthPoints = computeAffinePixelPoints(pixelWidth, toOriginX, toOriginX + toWidth);
    this.heightPoints = computeAffinePixelPoints(pixelHeight, toOriginY, toOriginY + toHeight);
    let counter: number = 0;

    return Observable.from<number,number>(this.widthPoints)
      .flatMap<number, PointMap>((xVal: number, xIdx: number) => {
        return Observable.from<number, number>(this.heightPoints)
          .map<number, PointMap>((yVal: number, yIdx: number) => {
            const id = counter++;
            return new PointMap(new Point(id, xIdx, yIdx), new Point(id, xVal, yVal));
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
   * @param seedPhrase      A text phrase that will deterministically seed a function mapping
   *                        coordinates in the logical domain to color values.
   * @param integralBufSize The size of the buffer to fill each livenessLatency interval.
   *                        It is very imporant that this value be chosen such that the total
   *                        pixel count is an even multiple of it, otherwise this routine will
   *                        never finish working!
   * @param livenessLatency The computation pause duration between filled buffers of size
   *                        integralBufSize.  Implemented since this computation occurs on the
   *                        UI thread and that UI would therefore become unresponsive if this
   *                        work were done all in one loop through all required iterations.
   * @returns {Observable<PaintablePoint>} A stream of canvas coordinate to logial color pairs.
   */
  public performGradualColorTransform(
    region: Observable<PointMap>, seedPhrase: string,
    integralBufSize: number = 100, livenessLatency: number = 750
  ): Observable<PaintablePoint> {
    const phraseModel = randomArtFactory.new_picture(seedPhrase);

    // For this to work, the the total pixel count MUST be an even multiple of
    // the overall pixel count.  Otherwise, the final buffer never can flush
    // and the sequence may repeat from the beginning, attempting to force that to
    // happen!
    return region.bufferCount(integralBufSize)
      .zip(Observable.interval(livenessLatency))
      .map<[PointMap[], number],PointMap[]>(
        function (pointMapsPair: [PointMap[], number]) {
          return pointMapsPair[0];
        }
      ).flatMap<PointMap[],PaintablePoint>(
        function (pointMap: PointMap[]) {
          return Observable.from(
            pointMap.filter(
              function (pointMap: PointMap) {
                return typeof pointMap === 'object';
              }
            ).map(
              function (pointMap: PointMap) {
                return pointMap.from.withFillStyle(
                  randomArtFactory.compute_pixel(
                    phraseModel, pointMap.to.x, pointMap.to.y, 1, 1
                  )
                );
              }
            )
          );
        }
      );
  }
}

