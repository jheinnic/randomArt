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

  public performGradualColorTransform(
    region: Observable<PointMap>, seedPhrase: string
  ): Observable<PaintablePoint> {
    // Prepare a delay function that staggers the inputs.
    const initialDelay = 2;
    const incrementalDelay = 3;
    let delaySubject = Observable.of(initialDelay)
      .expand(function (val: number, index: number) {
        let delay = val + incrementalDelay;
        return Observable.of(delay)
      });

    const phraseModel = randomArtFactory.new_picture(seedPhrase);
    // let output = new ReplaySubject<PaintablePoint>(10000, 2500);
    // let retVal: Observable<PaintablePoint> = output.asObservable();

    let counter = 0;
    let intervalSource = Observable.interval(1);
    let step2 = region.bufferCount(1920)
      .do<PointMap[]>(function (val: PointMap[]) { console.log(`Observed ${JSON.stringify(val)} window emission at ${new Date()}`);});
    // .delayWhen<PointMap[]>(function () {
    //   return partial.do(function (val) { })
    //     .delay(10);
    // })
    // .do<PointMap[]>(function (val) { console.log(`Observed ${val.length} delay emission at ${new Date()}`);}
    let retZip = step2.zip(Observable.interval(1500));
    let retVal = retZip.map<[PointMap[], number],PointMap[]>((pointMapsPair: [PointMap[], number]) => {
      return pointMapsPair[0];
    })
      .flatMap<PointMap[],PaintablePoint>(function (pointMap: PointMap[]) {
        return Observable.from(pointMap.filter(function (pointMap: PointMap) {
          return typeof pointMap === 'object';
        })
          .map(function (pointMap: PointMap) {
            return pointMap.from.withFillStyle(randomArtFactory.compute_pixel(phraseModel, pointMap.to.x, pointMap.to.y, 1, 1));
          }));
      });
    // .do<PaintablePoint[]>(function (val) {
    //   console.log(`Observed ${val.length} output emission at ${new Date()}`);
    // });

    // const subscription = partial.subscribe(function (computedPixels: PaintablePoint[]) {
    //   counter = counter + computedPixels.length;
    //   computedPixels.forEach( function(paintPoint: PaintablePoint) {
    //     console.log(`Sending ${PaintablePoint.asString(paintPoint)}`);
    //     output.next(paintPoint);
    //   });
    // }, function (error) {
    //   console.error(`Error while computing ${counter} pixels for phrase <${seedPhrase}>: ${error}`);
    // }, function () {
    //   console.log(`Finished computing ${counter} pixels for phrase <${seedPhrase}>`);
    // });

    return retVal;
  }

  /*
   public
   oldPerformGradualColorTransform(region
   :
   Observable < PointMap >, seedPhrase
   :
   string, output
   :
   Subject < PaintablePoint >
   )
   {
   region.count(function () { return true; })
   .subscribe(function (numPoints: number) {
   console.log(`Counted ${numPoints} values in PointMap stream.`);

   const phraseModel = randomArtFactory.new_picture(seedPhrase);
   const interval$: Observable<number> = Observable.interval(100)
   .do(function (value: number) {
   console.log(`Tick #${value} at ${new Date}`);
   });

   const repeatablePath = region.publish()
   .do((value: PointMap) => { console.log(`Saw ${PointMap.asString(value)} come in...`); })
   .map<PointMap,PaintablePoint>((pointMap: PointMap) => {
   return pointMap.from.withFillStyle(randomArtFactory.compute_pixel(phraseModel, pointMap.to.x, pointMap.to.y, 1, 1));
   })
   .takeUntil(interval$);

   const recurrentMap = repeatablePath.repeatWhen(function (notifications: Observable<any>) {
   return notifications.delay(150)
   .withLatestFrom(doneCounter)
   .takeWhile(function (latestOutput) {
   console.log(`Considering replay at ${new Date()} ${latestOutput[0]} and ${JSON.stringify(latestOutput[1])}`);
   return latestOutput[1][0] < numPoints;
   });
   });

   const doneCounter = Observable.range(1, numPoints)
   .zip(recurrentMap);

   const timeSubscription = interval$.subscribe(function (value) {
   console.log(`Tock #${value} at ${new Date}`);
   });

   const subscription = doneCounter.map(function (values) {
   return values[1];
   })
   .subscribe(function (computedPixel: PaintablePoint) {
   output.next(computedPixel);
   }, function (error) {
   console.error(`Error while computing pixels for phrase <${seedPhrase}>: ${error}`);
   }, function () {
   console.log(`Finished computing pixels for phrase <${seedPhrase}>`);
   timeSubscription.unsubscribe();
   });
   });
   }
   */
}
