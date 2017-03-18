"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by jheinnic on 12/31/16.
 */
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var base_url_values_1 = require("../base-url.values");
var lb_config_1 = require("../sdk/lb.config");
var RealTimeManager = (function () {
    function RealTimeManager(realTime) {
        var _this = this;
        this.realTime = realTime;
        this.returnSubject = new rxjs_1.AsyncSubject();
        lb_config_1.LoopBackConfig.setBaseURL(base_url_values_1.BASE_URL);
        lb_config_1.LoopBackConfig.setApiVersion(base_url_values_1.API_VERSION);
        this.rtSubscription = this.realTime.onReady().map(function () { return _this.realTime.FireLoop; }).subscribe(this.returnSubject);
    }
    Object.defineProperty(RealTimeManager.prototype, "connection", {
        get: function () {
            return this.returnSubject.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    RealTimeManager.prototype.dispose = function () {
    };
    return RealTimeManager;
}());
RealTimeManager = __decorate([
    core_1.Injectable()
], RealTimeManager);
exports.RealTimeManager = RealTimeManager;
