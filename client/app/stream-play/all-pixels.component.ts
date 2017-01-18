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
  paintablePixels: Observable<[PaintablePoint[], number]>;

  paintPointList: Immutable.List<PaintablePoint>;
  displayWindow: number = 25;
  counter: number = 0;

  constructor(private psSvc: PointStreamService, private ngZone:NgZone) {
    this.paintPointList = Immutable.List<PaintablePoint>()
    this.sourcePointMaps = psSvc.mapRectangularRegion(480, 480);
  }

  public trackByFn(paintPoint: PaintablePoint) {
    return paintPoint.id;
  }

  public ngAfterViewInit() {
    this.paintablePixels = this.psSvc.performGradualColorTransform(
      this.sourcePointMaps, 480*480, "hypocrtic oath");
    this.ngZone.runOutsideAngular( () => {
      setTimeout( () => { this.drawPixels(); }, 5);
    });
  }

  private drawPixels () {
    if (! this.subscription) {
      this.subscription = this.paintablePixels.subscribe(
        (paintPoints: [PaintablePoint[], number]) => {
          this.ngZone.run(() => {
            this.paintPointList = Immutable.List<PaintablePoint>(paintPoints[0]);
          });
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
