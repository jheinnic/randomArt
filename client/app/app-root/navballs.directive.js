"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by jheinnic on 1/11/17.
 */
var core_1 = require("@angular/core");
;
;
var NavBallsDirective = (function () {
    function NavBallsDirective(ngZone) {
        this.ngZone = ngZone;
        this.width = 1920;
        this.height = 64;
    }
    NavBallsDirective.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.canvas = this.element.nativeElement;
        this.ctx = this.canvas.getContext("2d"),
            // let tempCtx = tempCanvas.getContext("2d"),
            this.threshold = 210, this.colors = {
            r: 255,
            g: 0,
            b: 0
        };
        this.cycle = 0;
        this.points = [];
        // canvas.width = tempCanvas.width = width;
        // canvas.height= tempCanvas.height= height;
        for (var i = 0; i < 50; i++) {
            var x = Math.random() * this.width, y = Math.random() * this.height, dx = (Math.random()
                * 8) - 4, dy = (Math.random() * 8) - 4, size = Math.floor(Math.random() * 60) + 60;
            this.points.push({
                x: x,
                y: y,
                dx: dx,
                dy: dy,
                size: size
            });
        }
        setTimeout(function () { _this.update(); }, 10);
    };
    NavBallsDirective.prototype.update = function () {
        var _this = this;
        var len = this.points.length;
        // this.tempCtx.clearRect(0,0,this.width,this.height);
        this.ctx.clearRect(0, 0, this.width, this.height);
        while (len--) {
            var point = this.points[len];
            point.x += point.dx;
            point.y += point.dy;
            if (point.x > this.width + point.size) {
                point.x = 0 - point.size;
            }
            if (point.x < 0 - point.size) {
                point.x = this.width + point.size;
            }
            if (point.y > this.height + point.size) {
                point.y = 0 - point.size;
            }
            if (point.y < 0 - point.size) {
                point.y = this.height + point.size;
            }
            this.ctx.beginPath();
            var grad = this.ctx.createRadialGradient(point.x, point.y, 1, point.x, point.y, point.size);
            grad.addColorStop(0, 'rgba(' + this.colors.r + ',' + this.colors.g + ',' + this.colors.b
                + ',1)');
            grad.addColorStop(1, 'rgba(' + this.colors.r + ',' + this.colors.g + ',' + this.colors.b
                + ',0)');
            this.ctx.fillStyle = grad;
            this.ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.metabalize();
        this.colorCycle();
        setTimeout(function () { _this.update(); }, 10);
    };
    NavBallsDirective.prototype.colorCycle = function () {
        this.cycle += 0.1;
        if (this.cycle > 100) {
            this.cycle = 0;
        }
        this.colors.r = ~~(Math.sin(.3 * this.cycle + 0) * 127 + 128);
        this.colors.g = ~~(Math.sin(.3 * this.cycle + 2) * 127 + 128);
        this.colors.b = ~~(Math.sin(.3 * this.cycle + 4) * 127 + 128);
    };
    NavBallsDirective.prototype.metabalize = function () {
        var imageData = this.ctx.getImageData(0, 0, this.width, this.height), pix = imageData.data;
        for (var i = 0, n = pix.length; i < n; i += 4) {
            // Checks threshold
            if (pix[i + 3] < this.threshold) {
                pix[i + 3] /= 6;
                if (pix[i + 3] > this.threshold / 4) {
                    pix[i + 3] = 0;
                }
            }
        }
        this.ctx.putImageData(imageData, 0, 0);
    };
    return NavBallsDirective;
}());
__decorate([
    core_1.ContentChild('navballs')
], NavBallsDirective.prototype, "element", void 0);
NavBallsDirective = __decorate([
    core_1.Directive({
        selector: 'canvas[navballs]',
        host: {
            'dimensions': '{width: 1920, height:64}',
            'class.fixed-top': 'true',
            'class.md-elevation-z1': 'true',
            'id': '"navballs"'
        }
    })
], NavBallsDirective);
exports.NavBallsDirective = NavBallsDirective;
