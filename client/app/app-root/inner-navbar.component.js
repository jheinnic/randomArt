"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var navbar_data_datamodel_1 = require("./navbar-data.datamodel");
var InnerNavbarComponent = (function () {
    function InnerNavbarComponent(navbarDataService) {
        var _this = this;
        this.navbarDataService = navbarDataService;
        this.navbarData = new navbar_data_datamodel_1.NavbarData();
        this.updateNavbarData = function (newData) {
            // console.log("Navbar receives new data model: " + JSON.stringify(newData));
            _this.navbarData = newData;
        };
        this.navbarData = Object.assign(new navbar_data_datamodel_1.NavbarData(), { brandName: 'placeholder' });
        this.navbarSubscription =
            this.navbarDataService.navbarData.subscribe(this.updateNavbarData, function (error) { return console.error(error); }, function () { _this.navbarSubscription = undefined; });
        this.rlaSafe = false;
    }
    InnerNavbarComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // https://github.com/angular/material2/issues/1967 workaround.  When routerLink is
        // dynamically bound, it is still an empty array by the time that isActive first starts
        // to check it.  Use setTimeout for nextTick as ngAfterViewInit is called after the
        // current tick's content check has already completed.
        setTimeout(function () {
            _this.rlaSafe = true;
        }, 0);
    };
    InnerNavbarComponent.prototype.ngOnDestroy = function () {
        this.navbarSubscription.unsubscribe();
    };
    return InnerNavbarComponent;
}());
InnerNavbarComponent = __decorate([
    core_1.Component({
        moduleId: './app/app-root/app-root.component',
        selector: 'inner-navbar',
        templateUrl: './_inner-navbar.view.html',
    })
], InnerNavbarComponent);
exports.InnerNavbarComponent = InnerNavbarComponent;
