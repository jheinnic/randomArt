"use strict";
/**
 * Created by jheinnic on 1/28/17.
 */
var builder = require("fluent-interface-builder");
var datamodel_ts_1 = require("../../../common/lib/datamodel-ts");
var Observable_1 = require("rxjs/Observable");
var point_datamodel_1 = require("../shared/canvas-util/point.datamodel");
var rxjs_1 = require("rxjs");
var randomArtFactory = require("./genjs");
var worker_lifecycle_datamodel_1 = require("../shared/service-util/worker-lifecycle.datamodel");
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
        // console.log(lowLowHigh, minHighHigh, highLowHigh, altHighLowHigh);
        if (lowLowHigh > highLowHigh) {
            highLowHigh = lowLowHigh;
        }
        return highLowHigh;
    }
}
// Project [0...(pointCount)] onto [minValue...maxValue] by affine
// matrix transformation in such a way that the set is symetrically
// balanced (e.g. same distance between any consecutive points and
// the distance between either max or min and the center point are
// identitcal.
//
// To do this, consider the symetrial set of pointCount+1 items,
// and enumerate the values at the midpoint between any two points.
function computeAffinePixelPoints(pointCount, minValue, maxValue) {
    // console.log(`Calculating map from [0...${pointCount}-1] onto [${minValue}...${maxValue}]`)
    var initial = 0.5;
    var translate = minValue;
    var scale = (maxValue - minValue) / (pointCount - 0);
    var pointsArray = [];
    for (var ii = initial; ii < pointCount; ii += 1) {
        pointsArray.push((ii * scale) + translate);
    }
    return pointsArray;
}
function mergePointArrays(widthPoints, heightPoints) {
    return Observable_1.Observable.from(widthPoints)
        .flatMap(function (xVal, xIdx) {
        return Observable_1.Observable.from(heightPoints)
            .map(function (yVal, yIdx) {
            return [
                new point_datamodel_1.Point(undefined, {
                    x: xIdx,
                    y: yIdx
                }), new point_datamodel_1.Point(undefined, {
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
function derivePointMaps(imageChain) {
    var xScale = 1.0;
    var yScale = 1.0;
    if (imageChain.pixelWidth === imageChain.pixelHeight) {
        if (imageChain.fitOrFill !== 'square') {
            throw new Error("fitOrFill must be square if width === height");
        }
    }
    else if (imageChain.fitOrFill === 'square') {
        throw new Error("fitOrFill cannot be square unless width === height");
    }
    else if (imageChain.pixelWidth > imageChain.pixelHeight) {
        if (imageChain.fitOrFill === 'fill') {
            xScale = imageChain.pixelWidth / imageChain.pixelHeight;
        }
        else {
            yScale = imageChain.pixelHeight / imageChain.pixelWidth;
        }
    }
    else if (imageChain.fitOrFill === 'fill') {
        yScale = imageChain.pixelHeight / imageChain.pixelWidth;
    }
    else {
        xScale = imageChain.pixelWidth / imageChain.pixelHeight;
    }
    var widthPoints = computeAffinePixelPoints(imageChain.pixelWidth, -1 * xScale, xScale);
    var heightPoints = computeAffinePixelPoints(imageChain.pixelHeight, -1 * yScale, yScale);
    return mergePointArrays(widthPoints, heightPoints);
}
var PointMapBatch = (function () {
    function PointMapBatch(phraseModel, pointMaps) {
        this.phraseModel = phraseModel;
        this.pointMaps = pointMaps;
    }
    return PointMapBatch;
}());
/**
 * Encapsulation for a partial set of paintable pixels, giving
 */
var PaintProgress = (function () {
    function PaintProgress(paintPoints, pctDone) {
        this.paintPoints = paintPoints;
        this.pctDone = pctDone;
    }
    return PaintProgress;
}());
exports.PaintProgress = PaintProgress;
var wrapCreateImagesActivity = builder.build()
    .chain('reset', function () { return function (context) {
    var retVal = context;
    switch (context.stage) {
        case worker_lifecycle_datamodel_1.ServiceStage.killed:
        case STATE.CANCELLED:
        case STATE.FINISHED:
        case STATE.MAY_RETRY:
        case STATE.FAILED:
        case STATE.EXCEPTION:
            context.cancelSubscription.unsubscribe();
            context.cancelationFlag.next(false);
            context.liveDelayFeed.next(Observable_1.Observable.never());
            context.paintPhraseFeed.next(Observable_1.Observable.never());
            retVal = new CreateImagesActivity(context, {
                stage: worker_lifecycle_datamodel_1.ServiceStage.offline,
                currentTask: undefined,
                cancelSubscription: undefined
            });
            setTimeout(function () {
                context.onReset.next();
            }, 0);
            break;
        case worker_lifecycle_datamodel_1.ServiceStage.offline:
            break;
        default:
            throw new Error("Illegal transition.  Expected not ACTIVE or PAUSED; found "
                + context.stage);
    }
    return retVal;
}; })
    .chain('dimensions', function (pixelWidth, pixelHeight, fitOrFill) {
    if (fitOrFill === void 0) { fitOrFill = 'fit'; }
    return function (context) {
        var retVal = context;
        switch (context.stage) {
            case worker_lifecycle_datamodel_1.ServiceStage.offline:
                if ((context.pixelWidth !== pixelWidth) || (context.pixelHeight !== pixelHeight) || ((pixelWidth !== pixelHeight) && (context.fitOrFill !== fitOrFill))) {
                    var xScale = 1.0;
                    var yScale = 1.0;
                    var deltas = {};
                    if (pixelWidth === pixelHeight) {
                        Object.assign(deltas, { fitOrFill: 'square' });
                    }
                    else if (fitOrFill === 'square') {
                        throw new Error("fitOrFill cannot be square unless width === height");
                    }
                    else {
                        Object.assign(deltas, { fitOrFill: fitOrFill });
                        if (pixelWidth > pixelHeight) {
                            if (fitOrFill === 'fill') {
                                xScale = pixelWidth / pixelHeight;
                            }
                            else {
                                yScale = pixelHeight / pixelWidth;
                            }
                        }
                        else if (fitOrFill === 'fill') {
                            yScale = pixelHeight / pixelWidth;
                        }
                        else {
                            xScale = pixelWidth / pixelHeight;
                        }
                    }
                    var newPixelCount = pixelWidth * pixelHeight;
                    if (context.pixelCount !== newPixelCount) {
                        Object.assign(deltas, {
                            actualBufferSize: undefined,
                            iterationCount: undefined,
                            progressSequence: undefined,
                            pixelCount: newPixelCount
                        });
                    }
                    var widthPoints = computeAffinePixelPoints(pixelWidth, -1 * xScale, xScale);
                    var heightPoints = computeAffinePixelPoints(pixelHeight, -1 * yScale, yScale);
                    Object.assign(deltas, {
                        widthPoints: widthPoints,
                        heightPoints: heightPoints,
                        pointMap: derivePointMaps(widthPoints, heightPoints)
                    });
                    retVal = new CreateImagesActivity(context, deltas);
                }
                break;
            default:
                throw new Error("Illegal transition.  Expected BOOTSTRAP, found " + context.stage);
        }
        return retVal;
    };
})
    .chain('maxBufferSize', function (maxBufferSize) { return function (context) {
    switch (context.stage) {
        case worker_lifecycle_datamodel_1.ServiceStage.offline:
            return new CreateImagesActivity(context, {
                maxBufferSize: maxBufferSize,
                actualBufferSize: undefined,
                iterationCount: undefined,
            });
        default:
            throw new Error("Illegal transition.  Expected BOOTSTRAP, found " + context.stage);
    }
}; })
    .chain('liveDelayDuration', function (liveDelayDuration) { return function (context) {
    switch (context.stage) {
        case worker_lifecycle_datamodel_1.ServiceStage.offline:
            return new CreateImagesActivity(context, { liveDelayDuration: liveDelayDuration });
        default:
            throw new Error("Illegal transition.  Expected BOOTSTRAP, found " + context.stage);
    }
}; })
    .unwrap('ready', function () { return function (context) {
    switch (context.stage) {
        case worker_lifecycle_datamodel_1.ServiceStage.offline:
            var retVal = void 0;
            var iterationCount_1;
            var actualBufferSize = void 0;
            if ((context.actualBufferSize === undefined) || (context.iterationCount === undefined)) {
                actualBufferSize = findOptimalDivisor(context.pixelCount, context.maxBufferSize);
                iterationCount_1 = context.pixelCount / actualBufferSize;
            }
            else {
                actualBufferSize = context.actualBufferSize;
                iterationCount_1 = context.iterationCount;
            }
            // Setup cancelation option
            var isCancel_1 = false;
            var cancelSubscription = context.cancelationFlag.subscribe(function (value) { isCancel_1 = value; });
            var resultSource = context.paintPhraseFeed
                .asObservable()
                .switch()
                .map(function (paintTask) {
                var phraseModel = randomArtFactory.new_picture(paintTask.phrase);
                return context.pointMap
                    .bufferCount(context.actualBufferSize)
                    .map(function (batch) { return new PointMapBatch(phraseModel, batch); });
            })
                .concatMap(function (item) { return item; })
                .filter(function () { return !isCancel_1; })
                .finally(function () { context.cancelationFlag.next(false); })
                .zip(context.liveDelayFeed.asObservable()
                .switch())
                .map(function (pointMapsPair, index) {
                var paintablePoints = pointMapsPair[0].pointMaps
                    .map(function (pointMap) { return pointMap.from.withFillStyle(randomArtFactory.compute_pixel(pointMapsPair[0].phraseModel, pointMap.to.x, pointMap.to.y, 1, 1)); });
                var pctDone = (index + 1) / iterationCount_1;
                return new PaintProgress(paintablePoints, pctDone);
            });
            context.liveDelayFeed.next(resultSource.delay(context.liveDelayDuration));
            context.paintPhraseFeed.next(context.paintPhraseSubject.asObservable());
            return new CreateImagesActivity(context, {
                actualBufferSize: actualBufferSize,
                iterationCount: iterationCount_1,
                resultSource: resultSource,
                cancelSubscription: cancelSubscription
            });
        default:
            throw new Error("Illegal transition.  Expected BOOTSTRAP, found " + context.stage);
    }
}; });
/*
    .chain('paint', (phrase: string) => (context: CreateImagesActivity) => {
      let retVal = context;

      return retVal;
  })
    .chain('pause', () => (context: CreateImagesActivity) => {
      let retVal = context;

      return retVal;
  })
    .chain('resume', () => (context: CreateImagesActivity) => {
      let retVal = context;

      return retVal;
  })
    .chain('cancel', () => (context: CreateImagesActivity) => {
      let retVal = context;

      return retVal;
    })
    .chain('sendAck', (phrase: string) => (context: CreateImagesActivity) => {
      let retVal = context;

      return retVal;
    })
    .unwrap('unwrap', unwrapHelper);
*/
//
// Models
//
var defaultWidth = 360;
var defaultHeight = 240;
var defaultScale = defaultHeight / defaultWidth;
var defaultLiveDelayDuration = 250;
var defaultPixelCount = defaultWidth * defaultHeight;
var defaultWidthPoints = computeAffinePixelPoints(defaultWidth, -1, 1);
var defaultHeightPoints = computeAffinePixelPoints(defaultHeight, -1 * defaultScale, defaultScale);
var defaultPointMap = derivePointMaps(defaultWidthPoints, defaultHeightPoints);
var defaultMaxBufferSize = 1536;
var defaultActualBufferSize = findOptimalDivisor(defaultPixelCount, defaultMaxBufferSize);
var defaultIterCount = defaultPixelCount / defaultActualBufferSize;
var neverAny = Observable_1.Observable.never();
var CreateImagesActivity = (function () {
    function CreateImagesActivity(predecessor, data) {
        if (predecessor) {
            Object.assign(this, predecessor, data || {});
        }
        else {
            this.stage = worker_lifecycle_datamodel_1.ServiceStage.offline;
            this.maxBufferSize = defaultMaxBufferSize;
            this.liveDelayDuration = defaultLiveDelayDuration;
            // this.widthPoints = defaultWidthPoints;
            // this.heightPoints = defaultHeightPoints;
            // this.pointMap = defaultPointMap;
            this.actualBufferSize = defaultActualBufferSize;
            this.iterationCount = defaultIterCount;
            this.cancelationFlag = new rxjs_1.BehaviorSubject(false);
            this.paintPhraseSubject = new rxjs_1.Subject();
            this.paintPhraseFeed = new rxjs_1.BehaviorSubject(neverAny);
            this.liveDelayFeed = new rxjs_1.BehaviorSubject(neverAny);
            this.onReady = new rxjs_1.Subject();
            this.onBegin = new rxjs_1.Subject();
            this.onFinished = new rxjs_1.Subject();
            this.onCancel = new rxjs_1.Subject();
            this.onPause = new rxjs_1.Subject();
            this.onResume = new rxjs_1.Subject();
            this.onReset = new rxjs_1.Subject();
            if (data) {
                Object.assign(this, data);
            }
        }
    }
    // copy = copyMethodFactory(wrapCreateImagesActivity);
    CreateImagesActivity.prototype.copy = function (director) {
        var wrapper = wrapCreateImagesActivity.value(this);
        director(wrapper);
        return wrapper.unwrap();
    };
    return CreateImagesActivity;
}());
CreateImagesActivity.build = datamodel_ts_1.buildMethodFactory(wrapCreateImagesActivity, CreateImagesActivity);
exports.CreateImagesActivity = CreateImagesActivity;
