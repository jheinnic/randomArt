/**
 * Created by jheinnic on 1/1/17.
 */
import {Component, OnDestroy} from "@angular/core";
import {PointStreamService} from "./point-stream.service";
import {PointMap, PaintablePoint} from "./point.datamodel";
import {Observable, Subscription} from "rxjs";
import Immutable = require('immutable');
import lodash = require('lodash');
import path = require('path');

@Component({
  moduleId: path.relative(__dirname, __filename),
  selector: 'all-pixels',
  templateUrl: './_all-pixels.view.html',
  providers: [PointStreamService]
})
export class AllPixelsComponent implements OnDestroy
{
  sourcePointMaps: Observable<PointMap>;
  subscription: Subscription;
  paintablePixels: Observable<PaintablePoint>;

  paintPointList: Immutable.List<PaintablePoint>;
  displayWindow: number = 25;
  counter: number = 0;

  constructor(private psSvc: PointStreamService) {
    this.paintPointList = Immutable.List<PaintablePoint>()
    this.sourcePointMaps = psSvc.mapRectangularRegion(480, 480, -1, -1, 2, 2);
    this.paintablePixels = psSvc.performGradualColorTransform(
      this.sourcePointMaps, "hypocrtic oath");
    this.subscription =
      this.paintablePixels.subscribe((paintPoint: PaintablePoint) => {
        console.log(JSON.stringify(paintPoint));
        console.log(PaintablePoint.asString(paintPoint));
        var refVal = this.counter++;
        if (refVal > 30) {
          this.paintPointList = this.paintPointList.shift().push(paintPoint);
        } else {
          this.paintPointList = this.paintPointList.push(paintPoint);
        }
      }
    );
  }

  public trackByFn(paintPoint: PaintablePoint, index: number) {
    return PaintablePoint.asString(paintPoint);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
