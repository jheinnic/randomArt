"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/**
 * Created by jheinnic on 1/2/17.
 */
var core_1 = require("@angular/core");
var point_mapping_service_1 = require("./point-mapping.service");
var MAX_BUFFER_SIZE = 2000;
var LIVE_LATENCY = 600;
var WordPaintComponent = (function () {
    function WordPaintComponent(ngZone, pointService, canvasAccess) {
        _this = _super.call(this, ngZone) || this;
        this.pointService = pointService;
        this.canvasAccess = canvasAccess;
        // private widthPoints: number[];
        // private heightPoints: number[];
        // private scalePoints: Observable<PointMap>;
        this.canvasWidth = 640;
        this.canvasHeight = 480;
        this.paintCounter = 0;
        this.canvasReady = this.onReady;
        this.paintBegin = this.onBegin;
        this.paintDone = this.onDone;
        this.paintProgress = this.onProgress;
        this.paintPause = this.onPause;
        this.paintReset = this.onReset;
        this.paintResume = this.onResume;
        this.paintCancel = this.onCancel;
        this.paintAnyError = this.onAnyError;
        this.canvasWidth = this.imageChainDef.pixelWidth;
        this.canvasHeight = this.imageChainDef.pixelHeight;
        this.pointService.mapRectangularRegion(this.canvasWidth, this.canvasHeight, 'fit');
        var canvas = this.canvasRef.nativeElement;
        this.context = canvas.getContext('2d'); // .getContext('2d', {storage: true});
        this.context = canvasAccess.context;
        this.context.fillStyle = 'rgb(0,0,0)';
        this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
    WordPaintComponent.prototype.ngOnInit = function () {
        // close;
        /*
         this.widthPoints = this.imageChainDef.widthPoints.split(', ')
         .map((value) => {
         return +value;
         });
         this.heightPoints = this.imageChainDef.heightPoints.split(', ')
         .map((value) => {
         return +value;
         });
         this.scalePoints =
         this.pointService.mapRectangularRegion(
         this.widthPoints, this.heightPoints, 'fit'
         );
         */
        this.pointService.liveDelayDuration = LIVE_LATENCY;
        this.pointService.maxBufSize = MAX_BUFFER_SIZE;
        this.ready();
    };
    WordPaintComponent.prototype.paint = function () {
        this.paintCounter = 0;
        this.currentPhrase = this.inputPhrase;
        this.pointService.seedPhrase = this.currentPhrase;
        var outputSubject = this.pointService.stepSequence;
        this.begin(this.currentPhrase, outputSubject, 0);
    };
    WordPaintComponent.prototype.getImageDataFor = function (task) {
        return null;
    };
    WordPaintComponent.prototype.getImageBlobFor = function (task) {
        return null;
    };
    WordPaintComponent.prototype.doWorkStep = function (paintPoints) {
        paintPoints.forEach(function (paintPoint) {
            paintPoint.paintTo(this.context);
        });
        this.paintCounter += paintPoints.length;
        return this.paintCounter;
    };
    return WordPaintComponent;
}());
__decorate([
    core_1.ViewChildren('canvas')
], WordPaintComponent.prototype, "canvasRef", void 0);
__decorate([
    core_1.Output()
], WordPaintComponent.prototype, "canvasReady", void 0);
__decorate([
    core_1.Output()
], WordPaintComponent.prototype, "paintBegin", void 0);
__decorate([
    core_1.Output()
], WordPaintComponent.prototype, "paintDone", void 0);
__decorate([
    core_1.Output()
], WordPaintComponent.prototype, "paintPause", void 0);
__decorate([
    core_1.Output()
], WordPaintComponent.prototype, "paintResume", void 0);
__decorate([
    core_1.Output()
], WordPaintComponent.prototype, "paintCancel", void 0);
__decorate([
    core_1.Output()
], WordPaintComponent.prototype, "paintReset", void 0);
__decorate([
    core_1.Output()
], WordPaintComponent.prototype, "paintRelease", void 0);
__decorate([
    core_1.Output()
], WordPaintComponent.prototype, "paintProgress", void 0);
__decorate([
    core_1.Output()
], WordPaintComponent.prototype, "paintAnyError", void 0);
WordPaintComponent = __decorate([
    core_1.Component({
        moduleId: "./app/pool/word-paint.component",
        selector: "word-painter",
        inputs: ["inputPhrase", "imageChainDef"],
        outputs: [
            "onReady:canvasReady",
            "onBegin:paintBegin",
            "onProgress:paintProgress",
            "onPause:paintPause",
            "onResume:paintResume",
            "onFinish:paintFinish",
            "onCancel:paintCanel",
            "onError:paintError"
        ],
        providers: [point_mapping_service_1.PointMappingService],
        template: require("./_word-paint.view.html")
    }),
    __param(2, core_1.Host())
], WordPaintComponent);
exports.WordPaintComponent = WordPaintComponent;
/**
 * Converts a base64 string to byte array.
 */
function base64toBlob(base64Data, contentType, sliceSize) {
    if (contentType === void 0) { contentType = ''; }
    if (sliceSize === void 0) { sliceSize = 512; }
    var byteCharacters = atob(base64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
}
