import {Pipe} from "@angular/core";
import {PaintablePoint} from "./point.datamodel";
/**
 * Created by jheinnic on 1/1/17.
 */
@Pipe({
  name: 'paintPoint',
  pure: true
})
export class PaintablePointPipe {
  transform(paintablePoint: PaintablePoint): string {
    return PaintablePoint.asString(paintablePoint);
  }
}
