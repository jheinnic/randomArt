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
var navbar_data_datamodel_1 = require("./navbar-data.datamodel");
var ReplaySubject_1 = require("rxjs/ReplaySubject");
require("rxjs/add/operator/share");
var NavbarDataService = (function () {
    function NavbarDataService() {
        this.dataModel = new navbar_data_datamodel_1.NavbarData();
        this.dataSubject = new ReplaySubject_1.ReplaySubject(1);
        this.observableData = this.dataSubject.asObservable();
    }
    Object.defineProperty(NavbarDataService.prototype, "navbarData", {
        get: function () {
            return this.observableData;
        },
        enumerable: true,
        configurable: true
    });
    NavbarDataService.prototype.updateNavbar = function (director) {
        this.dataModel = this.dataModel.copy(director);
        this.dataSubject.next(this.dataModel);
    };
    return NavbarDataService;
}());
NavbarDataService = __decorate([
    core_1.Injectable()
], NavbarDataService);
exports.NavbarDataService = NavbarDataService;
