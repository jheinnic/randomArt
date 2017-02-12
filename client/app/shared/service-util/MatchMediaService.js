"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by jheinnic on 2/11/17.
 */
var core_1 = require("@angular/core");
var MatchMediaService = (function () {
    function MatchMediaService() {
        this.rules = {
            print: "print",
            screen: "screen",
            phone: '(max-width: 767px)',
            tablet: '(min-width: 768px) and (max-width: 1024px)',
            desktop: '(min-width: 1025px)',
            portrait: '(orientation: portrait)',
            landscape: '(orientation: landscape)',
            retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)'
        };
        this.Check = function (mq) {
            if (!mq) {
                return;
            }
            return window.matchMedia(mq).matches;
        };
        this.IsTablet = function () {
            return window.matchMedia(this.rules.tablet).matches;
        };
        this.IsDesktop = function () {
            return window.matchMedia(this.rules.desktop).matches;
        };
        this.IsPortrait = function () {
            return window.matchMedia(this.rules.portrait).matches;
        };
        this.IsLandscape = function () {
            return window.matchMedia(this.rules.landscape).matches;
        };
        this.IsRetina = function () {
            return window.matchMedia(this.rules.retina).matches;
        };
    }
    /**********************************************
     METHODS FOR CHECKING TYPE
     **********************************************/
    MatchMediaService.prototype.IsPhone = function () {
        return window.matchMedia(this.rules.phone).matches;
    };
    ;
    /**********************************************
     EVENT LISTENERS BY TYPE
     **********************************************/
    MatchMediaService.prototype.OnPhone = function (callBack) {
        if (typeof callBack === 'function') {
            var mql = window.matchMedia(this.rules.phone);
            mql.addListener(function (mql) {
                if (mql.matches) {
                    callBack(mql);
                }
            });
        }
    };
    ;
    MatchMediaService.prototype.OnTablet = function (callBack) {
        if (typeof callBack === 'function') {
            var mql = window.matchMedia(this.rules.tablet);
            mql.addListener(function (mql) {
                if (mql.matches) {
                    callBack(mql);
                }
            });
        }
    };
    ;
    MatchMediaService.prototype.OnDesktop = function (callBack) {
        if (typeof callBack === 'function') {
            var mql = window.matchMedia(this.rules.desktop);
            mql.addListener(function (mql) {
                if (mql.matches) {
                    callBack(mql);
                }
            });
        }
    };
    ;
    MatchMediaService.prototype.OnPortrait = function (callBack) {
        if (typeof callBack === 'function') {
            var mql = window.matchMedia(this.rules.portrait);
            mql.addListener(function (mql) {
                if (mql.matches) {
                    callBack(mql);
                }
            });
        }
    };
    ;
    MatchMediaService.prototype.OnLandscape = function (callBack) {
        if (typeof callBack === 'function') {
            var mql = window.matchMedia(this.rules.landscape);
            mql.addListener(function (mql) {
                if (mql.matches) {
                    callBack(mql);
                }
            });
        }
    };
    ;
    return MatchMediaService;
}());
MatchMediaService = __decorate([
    core_1.Injectable()
], MatchMediaService);
exports.MatchMediaService = MatchMediaService;
