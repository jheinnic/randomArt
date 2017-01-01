/**
 * Created by jheinnic on 12/25/16.
 */
import {Injectable} from "@angular/core";

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

// Project [0...(pointCount-1)] onto [minValue...maxValue] by affine
// matrix transformation.
function computeAffinePixelPoints(pointCount, minValue, maxValue) {
  var initial: number;
  if ((pointCount % 2) == 0) {
    initial = 0.5;
  } else {
    initial = 0;
  }

  const translate: number = 0 + minValue;
  const scale: number = (maxValue - minValue) / (pointCount - 1 - 0);

  let pointsArray = [];
  for (let ii = initial; ii < pointCount; ii += 1) {
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

  public streamRectangularOverlay() {

// Precompute the mapping between pixel indices and coordinate positions.
    this.widthPoints = computePixelPoints(896, -1, 1);
    this.heightPoints = computePixelPoints(896, -1, 1);
  }
}
