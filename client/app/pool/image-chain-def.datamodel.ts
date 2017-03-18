/**
 * Created by jheinnic on 2/4/17.
 */

import {PointMap, Point} from "../shared/canvas-util/point.datamodel";
import {Partial, FactoryWrapper, Pick, Director} from "../../../common/lib/datamodel-ts";
import {Observable} from "rxjs/Observable";
import Immutable = require("immutable");
import builder = require("fluent-interface-builder");
import {Builder} from "fluent-interface-builder";

export type FitOrFillType = 'fit' | 'fill' | 'square';

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
  let scale = (maxValue - minValue) / pointCount;

  let pointsArray = [];
  for (let ii = initial; ii < pointCount; ii += 1) {
    pointsArray.push((ii * scale) + translate);
  }
  return pointsArray;
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

type ImageChainDefWrapper = FactoryWrapper<ImageChainDef,ImageChainDefBuilder>;

const wrapImageChainDef: Builder<ImageChainDefWrapper,Partial<ImageChainDef>> =
  builder.build<ImageChainDefWrapper,Partial<ImageChainDef>>()
    .cascade(
      'dimensions',
      (pixelWidth: number, pixelHeight: number, fitOrFill: FitOrFillType) =>
        (context: Partial<ImageChainDef>) =>
          Object.assign(context, {
            pixelWidth: pixelWidth,
            pixelHeight: pixelHeight,
            fitOrFill: fitOrFill
          })
    )
    .cascade('displayName', (displayName:string) => (context: Partial<ImageChainDef>) =>
      Object.assign(context, {displayName: displayName})
    )
    .cascade('localId', (localId:number) => (context: Partial<ImageChainDef>) =>
      Object.assign(context, {localId: localId})
    )
    .cascade('uuid', (uuid:string) => (context: Partial<ImageChainDef>) =>
      Object.assign(context, {uuid: uuid})
    )
    .unwrap('unwrap', () => (context:Partial<ImageChainDef>) =>
      new ImageChainDef(context as Pick<ImageChainDef,Required>));


export interface ImageChainDefBuilder {
  dimensions(pixelWidth: number, pixelHeight: number, fitOrFill: FitOrFillType): this;
  displayName(displayName: string): this;
  localId(localId: number): this;
  uuid(uuid: string): this;
}

type Required = 'localId' | 'uuid' | 'displayName' | 'pixelWidth' | 'pixelHeight' | 'pixelCount' | 'fitOrFill';

export class ImageChainDef {
  localId: number;
  uuid: string;
  displayName: string;
  widthPoints: number[];
  heightPoints: number[];
  fitOrFill: FitOrFillType;
  pixelWidth: number;
  pixelHeight: number;
  pixelCount: number;
  pointMaps: Observable<PointMap>;
  createdAt: number;
  modifiedAt: number;

  constructor(params: Pick<ImageChainDef, Required>) {
    Object.assign(this, params);

    let now = new Date().getTime();
    let xScale = 1.0;
    let yScale = 1.0;

    if (this.pixelWidth === this.pixelHeight) {
      if (this.fitOrFill !== 'square') {
        throw new Error("fitOrFill must be square if width === height");
      }
    } else if (this.fitOrFill === 'square') {
      throw new Error("fitOrFill cannot be square unless width === height");
    } else if (this.pixelWidth > this.pixelHeight) {
      if (this.fitOrFill === 'fill') {
        xScale = this.pixelWidth / this.pixelHeight;
      } else {
        yScale = this.pixelHeight / this.pixelWidth;
      }
    } else if (this.fitOrFill === 'fill') {
      yScale = this.pixelHeight / this.pixelWidth;
    } else {
      xScale = this.pixelWidth / this.pixelHeight;
    }

    this.widthPoints = computeAffinePixelPoints(this.pixelWidth, -1 * xScale, xScale);
    this.heightPoints = computeAffinePixelPoints(this.pixelHeight, -1 * yScale, yScale);
    this.pointMaps = derivePointMaps(this.widthPoints, this.heightPoints)
    this.pixelCount = this.pixelWidth * this.pixelHeight;
    this.createdAt = now;
    this.modifiedAt = now;
  }

  static build(director: Director<ImageChainDefBuilder>): ImageChainDef {
    let wrapper = wrapImageChainDef.value({});
    director(wrapper);
    return wrapper.unwrap();
  }
}
