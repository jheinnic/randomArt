"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var task_lifecycle_datamodel_1 = require("../shared/service-util/task-lifecycle.datamodel");
var word_paint_progress_datamodel_1 = require("./word-paint-progress.datamodel");
var word_paint_result_datamodel_1 = require("./word-paint-result.datamodel");
var randomArtFactory = require("./genjs");
var WordPaintTask = (function (_super) {
    __extends(WordPaintTask, _super);
    function WordPaintTask(input, ngZone, subscription, launchSubject, paintableCanvas) {
        var _this = _super.call(this, input) || this;
        _this.input = input;
        _this.ngZone = ngZone;
        _this.subscription = subscription;
        _this.launchSubject = launchSubject;
        _this.paintableCanvas = paintableCanvas;
        _this.isCancelled = false;
        _this.model = randomArtFactory.new_picture(input.phrase);
        return _this;
    }
    Object.defineProperty(WordPaintTask.prototype, "phrase", {
        get: function () {
            return this.task.phrase;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WordPaintTask.prototype, "events", {
        get: function () {
            return _super.prototype.getEvents.call(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WordPaintTask.prototype, "cancelled", {
        get: function () {
            return this.isCancelled;
        },
        enumerable: true,
        configurable: true
    });
    WordPaintTask.prototype.begin = function () {
        this.launchSubject.next();
        _super.prototype.begin.call(this);
    };
    WordPaintTask.prototype.pause = function () {
        _super.prototype.pause.call(this);
    };
    WordPaintTask.prototype.resume = function () {
        _super.prototype.resume.call(this);
    };
    WordPaintTask.prototype.cancel = function () {
        _super.prototype.cancel.call(this);
        this.isCancelled = true;
    };
    WordPaintTask.prototype.doStep = function (stepContents, pctDone) {
        var _this = this;
        console.log("Inside doStep() for stepContents");
        var paintablePoints = stepContents
            .map(function (pointMap) { return pointMap.from.withFillStyle(randomArtFactory.compute_pixel(_this.model, pointMap.to.x, pointMap.to.y, 1, 1)); });
        console.log("Pre-ngZone, ", this);
        this.ngZone.run(function () {
            console.log('Back in angular zone');
            _super.prototype.report.call(_this, word_paint_progress_datamodel_1.WordPaintProgress.build(function (builder) {
                builder.pctDone(pctDone)
                    .paintPoints(paintablePoints);
            }));
            if ((pctDone === 1) && (!_this.isCancelled)) {
                var subscription_1 = _this.paintableCanvas.blob.subscribe(function (blob) {
                    if (!_this.isCancelled) {
                        _super.prototype.finish.call(_this, word_paint_result_datamodel_1.WordPaintResult.build(function (builder) {
                            builder.imageData(blob);
                        }));
                    }
                    subscription_1.unsubscribe();
                }, function (err) {
                    console.error(err);
                    subscription_1.unsubscribe();
                }, function () { subscription_1.unsubscribe(); });
            }
        });
    };
    WordPaintTask.prototype.retry = function () {
        _super.prototype.retry.call(this);
        this.isCancelled = false;
        this.begin();
    };
    WordPaintTask.prototype.acknowledge = function () {
        _super.prototype.acknowledge.call(this);
        this.subscription.unsubscribe();
    };
    return WordPaintTask;
}(task_lifecycle_datamodel_1.AbstractTask));
exports.WordPaintTask = WordPaintTask;
