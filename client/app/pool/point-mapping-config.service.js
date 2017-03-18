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
var core_1 = require("@angular/core");
/**
 * Created by jheinnic on 1/26/17.
 */
exports.pointMappingConfig = new core_1.OpaqueToken("pointMappingConfig");
var PointMappingConfig = (function () {
    function PointMappingConfig(config) {
        this.liveDelayDuration = 750;
        this.maxBufferSize = 750;
        Object.assign(this, config);
    }
    return PointMappingConfig;
}());
PointMappingConfig = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Optional()), __param(0, core_1.Inject(exports.pointMappingConfig))
], PointMappingConfig);
exports.PointMappingConfig = PointMappingConfig;