/**
 * Created by jheinnic on 1/7/17.
 */
import builder = require("fluent-interface-builder");
import {Partial} from "../../../../common/lib/datamodel-ts";

export class Point
{
  public readonly x: number = 0;
  public readonly y: number = 0;

  public constructor(point?: Point, override?: Partial<Point>) {
    Object.assign(this, point, override);
  }

  protected getLabel() { return 'Point'; }

  public withId(id: number) {
    return new IndexedPoint(this, {id: id});
  }

  public withFillStyle(fillStyle: string) {
    return new PaintablePoint(this, {fillStyle: fillStyle});
  }

  static asString(point: Point): string {
    let retVal: string;

    if (typeof point === 'object') {
      retVal = `<${point.x}, ${point.y}>`;
    } else if (typeof point === 'number') {
      retVal = `number(${point})`;
    } else {
      retVal = `**unknown point(${point})**`;
    }

    return retVal;
  }
}

export class IndexedPoint extends Point
{
  public readonly id: number = 0;

  public constructor(base?: Point, override?: Partial<IndexedPoint>) {
    super(base, override);
    Object.assign(this, base, override);
  }

  protected getLabel() { return 'IndexedPoint -> ' + super.getLabel(); }
}


export type FillStyle = string | CanvasGradient | CanvasPattern;

export class PaintablePoint extends IndexedPoint
{
  public readonly fillStyle: FillStyle = 'rgb(0,0,0)';

  public constructor(base?: Point, override?: Partial<PaintablePoint>) {
    super(base, override);
    Object.assign(this, base, override);
  }

  protected getLabel() { return 'PaintablePoint ->' + super.getLabel(); }

  public withId(id: number) {
    return new PaintablePoint(this, {id: id});
  }

  public paintTo(context: CanvasRenderingContext2D) {
    context.fillStyle = this.fillStyle;
    context.fillRect(this.x, this.y, 1, 1);
  }

  static asString(paintPoint: PaintablePoint) {
    let retVal: string;
    if (typeof paintPoint === 'object') {
      retVal = `(${paintPoint.fillStyle}) at <${paintPoint.x},${paintPoint.y}>`;
    } else {
      retVal = `**unknown paint point(${paintPoint})**`;
    }
    return retVal;
  }
}

export class PointMap
{
  fillStyle: string;

  public constructor(readonly from: IndexedPoint, readonly to: Point) { }

  get id(): number {
    return this.from.id;
  }

  static asString(pointMap: PointMap): string {
    let retVal: string;

    if (typeof pointMap === 'object') {
      retVal = `${Point.asString(pointMap.from)} -> ${Point.asString(pointMap.to)}`;
    } else if (typeof pointMap === 'number') {
      retVal = `number(${pointMap})`
    } else {
      retVal = `**unknown map(${pointMap})**`;
    }

    return retVal;
  }
}


