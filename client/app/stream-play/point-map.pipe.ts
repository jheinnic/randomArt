import {Pipe} from "@angular/core";
import {PointMap, Point} from "./point.datamodel";
/**
 * Created by jheinnic on 1/1/17.
 */
@Pipe({
  name: 'pointMap',
  pure: true
})
export class PointMapPipe {
  transform(pointMap: PointMap): string {
    return PointMap.asString(pointMap);
  }
}
