"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by jheinnic on 12/25/16.
 */
var core_1 = require("@angular/core");
var word_paint_task_class_1 = require("./word-paint-task.class");
var service_lifecycle_datamodel_1 = require("../shared/service-util/service-lifecycle.datamodel");
var point_datamodel_1 = require("../shared/canvas-util/point.datamodel");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
// Project [0...(pointCount)] onto [minValue...maxValue] by affine
var neverAny = Observable_1.Observable.never();
var PointMapBatch = (function () {
    function PointMapBatch(preparedTask, index, pointMaps) {
        this.preparedTask = preparedTask;
        this.index = index;
        this.pointMaps = pointMaps;
        this.completeAfterDone = new Subject_1.Subject();
    }
    PointMapBatch.prototype.linkToPrevious = function (previousObservable) {
        this.beginAfterComplete = previousObservable;
        return this.completeAfterDone.asObservable();
    };
    PointMapBatch.prototype.toString = function () {
        return this.preparedTask.task + ", #" + this.index + ", " + this.pointMaps.length + "; cancelled = " + this.preparedTask.cancelled;
    };
    return PointMapBatch;
}());
var PointMappingService = (function (_super) {
    __extends(PointMappingService, _super);
    function PointMappingService(ngZone, svcConfig) {
        var _this = _super.call(this) || this;
        _this.ngZone = ngZone;
        _this.svcConfig = svcConfig;
        _this.launch();
        return _this;
    }
    Object.defineProperty(PointMappingService.prototype, "stage", {
        get: function () {
            return this.getStage();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointMappingService.prototype, "events", {
        get: function () {
            return this.getEvents();
        },
        enumerable: true,
        configurable: true
    });
    PointMappingService.prototype.prepareTask = function (taskInput, canvasElement) {
        var _this = this;
        var imageChain = taskInput.chain;
        var paintPhrase = taskInput.phrase;
        var actualBufferSize = findOptimalDivisor(imageChain.pixelCount, this.svcConfig.maxBufferSize);
        var iterationCount = imageChain.pixelCount / actualBufferSize;
        var pointMaps = derivePointMaps(imageChain.widthPoints, imageChain.heightPoints);
        var pointMapBatches = pointMaps.bufferCount(actualBufferSize);
        var preparedTask;
        console.log(paintPhrase + ": " + imageChain.pixelCount + " pixels, " + actualBufferSize + " bytes, " + iterationCount + " iterations");
        var launchSubject = new Subject_1.Subject();
        var taskSubscription = pointMapBatches
            .delayWhen(function (item) { return Observable_1.Observable.of(item); }, launchSubject.asObservable())
            .map(function (subset, index) { return new PointMapBatch(preparedTask, index, subset); })
            .scan(function (lastCompleteAfter, nextBatch) {
            return [nextBatch, nextBatch.linkToPrevious(lastCompleteAfter[1])];
        }, [undefined, new BehaviorSubject_1.BehaviorSubject(null).asObservable()])
            .take(iterationCount)
            .map(function (pair) { return pair[0]; })
            .filter(function (batch) { return batch.preparedTask.cancelled === false; })
            .delayWhen(function (nextBatch) { return nextBatch.beginAfterComplete; })
            .delay(this.svcConfig.liveDelayDuration)
            .subscribe(function (batch) {
            if (batch.pointMaps) {
                _this.ngZone.runOutsideAngular(function () {
                    setTimeout(function () {
                        batch.preparedTask.doStep(batch.pointMaps, (batch.index + 1) / iterationCount);
                        if (batch.completeAfterDone) {
                            batch.completeAfterDone.complete();
                        }
                    }, 0);
                });
            }
        });
        return new word_paint_task_class_1.WordPaintTask(taskInput, this.ngZone, taskSubscription, launchSubject, canvasElement);
    };
    return PointMappingService;
}(service_lifecycle_datamodel_1.AbstractService));
PointMappingService = __decorate([
    core_1.Injectable()
], PointMappingService);
exports.PointMappingService = PointMappingService;
/**
 * Find the largest possible divisor of multiplicand that no greater than maxDivisor.
 *
 * @param multiplicand
 * @param maxDivisor
 */
function findOptimalDivisor(multiplicand, maxDivisor) {
    if ((multiplicand % maxDivisor) === 0) {
        return maxDivisor;
    }
    var ii;
    var sqrt = Math.floor(Math.sqrt(multiplicand));
    if (sqrt > maxDivisor) {
        for (ii = maxDivisor; ii > 1; ii--) {
            if ((multiplicand % ii) === 0) {
                return ii;
            }
        }
        return 1;
    }
    else {
        var highLowHigh = 0;
        for (ii = sqrt; highLowHigh === 0; ii--) {
            if ((multiplicand % ii) === 0) {
                highLowHigh = ii;
            }
        }
        var firstFound = true;
        var lowLowHigh = 0;
        for (ii = 2; (ii < highLowHigh) && (lowLowHigh === 0); ii++) {
            if ((multiplicand % ii) === 0) {
                lowLowHigh = multiplicand / ii;
                if (lowLowHigh > maxDivisor) {
                    lowLowHigh = 0;
                    firstFound = false;
                }
            }
        }
        if ((lowLowHigh > 0) && firstFound) {
            return lowLowHigh;
        }
        var altHighLowHigh = multiplicand / highLowHigh;
        if (altHighLowHigh <= maxDivisor) {
            highLowHigh = altHighLowHigh;
        }
        if (lowLowHigh > highLowHigh) {
            highLowHigh = lowLowHigh;
        }
        return highLowHigh;
    }
}
function derivePointMaps(widthPoints, heightPoints) {
    return Observable_1.Observable.from(widthPoints)
        .flatMap(function (xVal, xIdx) {
        return Observable_1.Observable.from(heightPoints)
            .map(function (yVal, yIdx) {
            return [
                new point_datamodel_1.Point(undefined, {
                    x: xIdx,
                    y: yIdx
                }),
                new point_datamodel_1.Point(undefined, {
                    x: xVal,
                    y: yVal
                })
            ];
        });
    })
        .map(function (pair, index) {
        return new point_datamodel_1.PointMap(pair[0].withId(index), pair[1]);
    });
}
