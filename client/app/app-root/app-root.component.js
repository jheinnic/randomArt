"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var shared_1 = require("../shared");
var AppRootComponent = (function () {
    function AppRootComponent(navbarDataService) {
        this.navbarDataService = navbarDataService;
        shared_1.LoopBackConfig.setBaseURL(shared_1.BASE_URL);
        shared_1.LoopBackConfig.setApiVersion(shared_1.API_VERSION);
    }
    AppRootComponent.prototype.ngOnInit = function () {
        this.navbarDataService.updateNavbar(function (builder) {
            builder.brandName('John Heinnickel')
                .addTab('Home', '/home')
                .addTab('About', '/about')
                .addTab('Lobby', '/lobby')
                .addTab('Points', '/pointMaps')
                .addTab('Gallery', '/gallery')
                .addTab('Lobby', '/lobby');
        });
    };
    return AppRootComponent;
}());
AppRootComponent = __decorate([
    core_1.Component({
        selector: "app-root",
        template: require("./_app-root.view.html")
    })
], AppRootComponent);
exports.AppRootComponent = AppRootComponent;
