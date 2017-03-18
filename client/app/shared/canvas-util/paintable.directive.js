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
 * Created by jheinnic on 1/11/17.
 */
var core_1 = require("@angular/core");
var AsyncSubject_1 = require("rxjs/AsyncSubject");
var point_datamodel_1 = require("./point.datamodel");
var PaintableDirective = (function () {
    function PaintableDirective(width, height) {
        this.resized = new core_1.EventEmitter();
        this.originalSize = {
            pixelWidth: width,
            pixelHeight: height
        };
        this.mySize = this.originalSize;
        // this.mySize = {
        //   pixelWidth: 480,
        //   pixelHeight: 480
        // };
        // this.canvas = canvasRef.nativeElement;
        // console.log("Constructor: ", this.canvasRef);
    }
    PaintableDirective.prototype.ngAfterViewInit = function () {
        this.canvasRef = this.domRef.nativeElement;
    };
    PaintableDirective.prototype.ngOnDestroy = function () {
        this.progressSubscript.unsubscribe();
    };
    Object.defineProperty(PaintableDirective.prototype, "width", {
        get: function () {
            return this.mySize.pixelWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaintableDirective.prototype, "height", {
        // public set width(value: number) {
        //   this.mySize = Object.assign({}, this.mySize, {pixelWidth: value});
        // }
        get: function () {
            return this.mySize.pixelHeight;
        },
        enumerable: true,
        configurable: true
    });
    // public set height(value: number) {
    //   this.mySize = Object.assign({}, this.mySize, {pixelHeight: value});
    // }
    /*
     @Input("sizable")
     public set sizable(value: string) {
     const nextSize;
     if (value) {
     let tokens = value.split('x');
     if (tokens.length === 2) {
     nextSize = Object.assign(), this.mySize || {}. value || {
     pixelWidth: pixelWidth,
     pixelHeight, pixelHeight
     }
     }
     if ((nextSize.pixelWidth !== this.width) || (nextSize.pixelHeight !== this.height)) {
     this.mySize = nextSize;
  
     if (this.domRef && this.canvasRef) {
     this.context = this.canvasRef.getContext("2d");
     this.resized.emit(this.mySize);
     }
  
     this.myBlob = undefined;
     }
     }
     }
  
     public get sizable(): Partial<Dimensions> {
     return this.mySize;
     }
     */
    // @Input("sizable")
    // public set sizable(value: Partial<Dimensions>) {
    //   const nextSize = Object.assign({}, this.mySize || {}, value || {});
    //
    //   if ((nextSize.pixelWidth !== this.width) || (nextSize.pixelHeight !== this.height)) {
    //     this.mySize = nextSize;
    //
    //     if (this.domRef && this.canvasRef) {
    //       this.context = this.canvasRef.getContext("2d");
    //       this.resized.emit(this.mySize);
    //     }
    //
    //     this.myBlob = undefined;
    //   }
    // }
    //
    // public get sizable(): Partial<Dimensions> {
    //   return this.mySize;
    // }
    // @Input("paintable")
    // public set paintable(paintableTask: WordPaintTask) {
    PaintableDirective.prototype.subscribeTo = function (paintTaskEvents) {
        if (this.progressSubscript) {
            this.progressSubscript.unsubscribe();
        }
        if (paintTaskEvents) {
            this.progressSubscript = paintTaskEvents.subscribe(function (event) {
                if (event.kind === 'began') {
                    this.mySize = {
                        pixelWidth: event.task.chain.pixelWidth,
                        pixelHeight: event.task.chain.pixelHeight,
                    };
                    this.clearView();
                }
                else if (event.kind === 'progress') {
                    this.paint(event.progress.paintPoints);
                }
                else if (event.kind === 'acknowledged') {
                    this.clearView();
                    if (this.progressSubscript) {
                        this.progressSubscript.unsubscribe();
                    }
                    else {
                        console.log('Event subscription had lapsed before previous shutdown.  Oh well..');
                    }
                }
                else {
                    console.log('Unexpected paintable task event, ' + JSON.stringify(this.event)
                        + ', while in state.');
                }
            }, function (error) { console.error(error); }, function () { this.progressSubscript = undefined; });
        }
    };
    // public get paintable(): Observable<PaintProgress> {
    //   return this.progressSource;
    // }
    PaintableDirective.prototype.paint = function (points) {
        var _this = this;
        if (points) {
            points.forEach(function (point) {
                if ((point.x < 0) || (point.x >= _this.width)) {
                    throw new Error("Point " + point_datamodel_1.PaintablePoint.asString(point) + " is out of bounds for " + _this.width + " x " + _this.height + ".");
                }
                if ((point.y < 0) || (point.y >= _this.height)) {
                    throw new Error("Point " + point_datamodel_1.PaintablePoint.asString(point) + " is out of bounds for " + _this.width + " x " + _this.height + ".");
                }
                point.paintTo(_this.context);
            });
        }
    };
    Object.defineProperty(PaintableDirective.prototype, "dataUrl", {
        get: function () {
            var retVal;
            if (this.canvasRef) {
                retVal = this.canvasRef.toDataURL("image/png");
            }
            return retVal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaintableDirective.prototype, "blob", {
        get: function () {
            var retVal;
            if (this.myBlob) {
                retVal = this.myBlob;
            }
            else {
                this.myBlob = new AsyncSubject_1.AsyncSubject();
                retVal = this.myBlob;
                this.canvasRef.toBlob(function (blob) {
                    retVal.next(blob);
                    retVal.complete();
                }, "image/png");
            }
            return retVal.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    PaintableDirective.prototype.flushBlob = function () {
        this.myBlob = undefined;
    };
    PaintableDirective.prototype.clearView = function () {
        this.flushBlob();
        // TODO: More to cleanup still!!!
    };
    return PaintableDirective;
}());
__decorate([
    core_1.ContentChild("canvas[paintable]")
], PaintableDirective.prototype, "domRef", void 0);
__decorate([
    core_1.Output()
], PaintableDirective.prototype, "resized", void 0);
__decorate([
    core_1.HostBinding("width")
], PaintableDirective.prototype, "width", null);
__decorate([
    core_1.HostBinding("height")
], PaintableDirective.prototype, "height", null);
PaintableDirective = __decorate([
    core_1.Directive({
        selector: "canvas[paintable]"
    }),
    __param(0, core_1.Attribute("width")), __param(1, core_1.Attribute("height"))
], PaintableDirective);
exports.PaintableDirective = PaintableDirective;
