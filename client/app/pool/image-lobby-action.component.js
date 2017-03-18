"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by jheinnic on 1/17/17.
 */
var core_1 = require("@angular/core");
var ImageLobbyActionComponent = (function () {
    function ImageLobbyActionComponent(navbarDataService) {
        var _this = this;
        this.navbarDataService = navbarDataService;
        this.willPaint = true;
        this.isPainting = false;
        this.subscription = this.navbarDataService.navbarData.subscribe(function (data) {
            _this.navbarData = data;
        });
    }
    ImageLobbyActionComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    Object.defineProperty(ImageLobbyActionComponent.prototype, "sidenavOpen", {
        get: function () {
            return this.navbarData.sidenavOpen;
        },
        enumerable: true,
        configurable: true
    });
    ImageLobbyActionComponent.prototype.openSidenav = function () {
        this.navbarDataService.updateNavbar(function (builder) {
            builder.openSidenav();
        });
    };
    ImageLobbyActionComponent.prototype.beginPainting = function () {
        this.willPaint = false;
        this.isPainting = true;
    };
    ImageLobbyActionComponent.prototype.scheduleNext = function () {
        this.willPaint = true;
        this.isPainting = false;
    };
    return ImageLobbyActionComponent;
}());
ImageLobbyActionComponent = __decorate([
    core_1.Component({
        moduleId: './app/pool/image-lobby-action.component',
        templateUrl: './_image-lobby-action.view.html'
    })
], ImageLobbyActionComponent);
exports.ImageLobbyActionComponent = ImageLobbyActionComponent;
