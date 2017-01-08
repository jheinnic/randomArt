/**
 * Created by jheinnic on 1/7/17.
 */

export class Point
{
  public constructor(readonly id: number, readonly x: number, readonly y: number) { }

  public withFillStyle(fillStyle: string) {
    return new PaintablePoint(this, fillStyle);
  }

  static asString(point: Point): string {
    let retVal: string;


    if (typeof point === 'object') {
      retVal = `<${point.x}, ${point.y}>`;
    } else if (typeof point === 'number') {
      return `number(${point})`
    } else {
      retVal = `**unknown point(${point})**`;
    }

    return retVal;
  }
}

export class PointMap
{
  fillStyle: string;

  public constructor(readonly from: Point, readonly to: Point) { }

  get id(): number {
    return this.from.id;
  }

  static asString(pointMap: PointMap): string {
    let retVal: string;

    if (typeof pointMap === 'object') {
      retVal = `${Point.asString(pointMap.from)} -> ${Point.asString(pointMap.to)}`;
    } else if (typeof pointMap === 'number') {
      return `number(${pointMap})`
    } else {
      retVal = `**unknown map(${pointMap})**`;
    }

    return retVal;
  }
}

export class PaintablePoint extends Point {
  public constructor(point: Point, public readonly fillStyle: string) {
    super(point.id, point.x, point.y);
  }

  public paintTo( context: CanvasRenderingContext2D ) {
    context.fillStyle = this.fillStyle;
    context.fillRect(this.x, this.y, 1, 1);
  }

  static asString(paintPoint: PaintablePoint) {
    if (typeof paintPoint === 'object') {
      return `(${paintPoint.fillStyle}) at <${paintPoint.x},${paintPoint.y}>`;
    } else {
      return `**unknown paint point(${paintPoint})**`;
    }
  }
}
