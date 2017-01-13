/**
 * Created by jheinnic on 1/1/17.
 */
import {Component, OnDestroy, AfterViewInit, NgZone} from "@angular/core";
import {PointStreamService} from "./point-stream.service";
import {PointMap, PaintablePoint} from "./point.datamodel";
import {Observable, Subscription} from "rxjs";
import Immutable = require('immutable');
import lodash = require('lodash');
import path = require('path');

type DestroyedFlyweight = 'destroyed';

@Component({
  moduleId: path.relative(__dirname, __filename),
  selector: 'all-pixels',
  templateUrl: './_all-pixels.view.html',
  providers: [PointStreamService]
})
export class AllPixelsComponent implements AfterViewInit, OnDestroy
{
  sourcePointMaps: Observable<PointMap>;
  subscription: Subscription | DestroyedFlyweight;
  paintablePixels: Observable<PaintablePoint>;

  paintPointList: Immutable.List<PaintablePoint>;
  displayWindow: number = 25;
  counter: number = 0;

  constructor(private psSvc: PointStreamService, private ngZone:NgZone) {
    this.paintPointList = Immutable.List<PaintablePoint>()
    this.sourcePointMaps = psSvc.mapRectangularRegion(480, 480, -1, -1, 2, 2);
  }

  public trackByFn(paintPoint: PaintablePoint, index: number) {
    return PaintablePoint.asString(paintPoint);
  }

  public ngAfterViewInit() {
    this.paintablePixels = this.psSvc.performGradualColorTransform(
      this.sourcePointMaps, "hypocrtic oath");
    this.ngZone.runOutsideAngular( () => {
      setTimeout( () => { this.drawPixels(); }, 5);
    });
  }

  private drawPixels () {
    if (! this.subscription) {
      this.subscription = this.paintablePixels.subscribe(
        (paintPoint: PaintablePoint) => {
          console.log(JSON.stringify(paintPoint));
          console.log(PaintablePoint.asString(paintPoint));
          var refVal = this.counter++;
          if (refVal > 30) {
            this.ngZone.run(() => {
              this.paintPointList = this.paintPointList.shift()
                .push(paintPoint);
            });
          } else {
            this.ngZone.run(() => {
              this.paintPointList = this.paintPointList.push(paintPoint);
            });
          }
        }
      );
    }
  };

  ngOnDestroy() {
    if (this.subscription && this.subscription instanceof Subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = 'destroyed';
  }
}
