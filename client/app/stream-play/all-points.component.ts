/**
 * Created by jheinnic on 1/1/17.
 */
import {Component, OnDestroy} from "@angular/core";
import {PointStreamService} from "./point-stream.service";
import {PointMap, Point} from "./point.datamodel";
import Immutable = require('immutable');
import {Observable, Subscription} from "rxjs";
import lodash = require('lodash');
import path = require('path');

@Component({
  moduleId: path.relative(__dirname, __filename),
  selector: 'all-points',
  templateUrl: './_all-points.view.html',
  providers: [PointStreamService]
})
export class AllPointsComponent implements OnDestroy {
  private pointMaps:Observable<PointMap>;
  private subscription: Subscription;

  pointMapList:Immutable.List<PointMap>;
  displayWindow: number = 25;
  counter: number = 0;

  constructor( private psSvc: PointStreamService) {
    this.pointMapList = Immutable.List<PointMap>()
    this.pointMaps = psSvc.streamSlowly(20, 1000);
    this.subscription = this.pointMaps.subscribe((pointMap:PointMap) => {
      var refVal = this.counter++;
      if (refVal > 18) {
        this.pointMapList = this.pointMapList.shift().push(pointMap);
      } else {
        this.pointMapList = this.pointMapList.push(pointMap);
      }
    });
  }

  public trackByFn(pointMap: PointMap, index: number) {
    return PointMap.asString(pointMap);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
