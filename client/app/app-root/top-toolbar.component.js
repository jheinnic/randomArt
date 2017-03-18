"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var authentication_1 = require("../authentication");
var navbar_data_datamodel_1 = require("./navbar-data.datamodel");
var sdk_1 = require("../shared/sdk");
var shared_1 = require("../shared");
var path = require("path");
var NO_USER_INFO = {
    username: 'anonymous', password: undefined, email: undefined
};
var TopToolbarComponent = (function () {
    function TopToolbarComponent(navbarDataService, modalService, userApi) {
        var _this = this;
        this.navbarDataService = navbarDataService;
        this.modalService = modalService;
        this.userApi = userApi;
        // private loginResultSubscription: Subscription;
        this.navbarData = new navbar_data_datamodel_1.NavbarData();
        this.updateNavbarData = function (newData) {
            // console.log("Navbar receives new data model: " + JSON.stringify(newData));
            _this.navbarData = newData;
        };
        sdk_1.LoopBackConfig.setBaseURL(shared_1.BASE_URL);
        sdk_1.LoopBackConfig.setApiVersion(shared_1.API_VERSION);
        this.userInfo = NO_USER_INFO;
        this.navbarData = Object.assign(new navbar_data_datamodel_1.NavbarData(), { brandName: 'placeholder' });
        this.navbarSubscription =
            this.navbarDataService.navbarData.subscribe(this.updateNavbarData);
    }
    TopToolbarComponent.prototype.ngOnDestroy = function () {
        this.navbarSubscription.unsubscribe();
        // if (this.loginResultSubscription) {
        //   this.loginResultSubscription.unsubscribe();
        //   this.loginResultSubscription = undefined;
        // }
        if (this.loginModalRef) {
            this.loginModalRef.close();
        }
    };
    TopToolbarComponent.prototype.onClickLogin = function () {
        var _this = this;
        this.loginModalRef =
            this.modalService.open(authentication_1.LoginModalComponent, { disableClose: false });
        var loginResultSubscription = this.loginModalRef.afterClosed()
            .subscribe(function (result) {
            _this.loginModalRef = undefined;
            loginResultSubscription.unsubscribe();
            console.log('result: ' + result);
            if (result) {
                _this.userInfo = result.userInfo;
            }
        });
    };
    TopToolbarComponent.prototype.isLoggedIn = function () {
        return this.userApi.isAuthenticated();
    };
    TopToolbarComponent.prototype.logout = function () {
        this.userApi.logout();
    };
    TopToolbarComponent.prototype.onClickRegister = function () {
    };
    TopToolbarComponent.prototype.onClickSettings = function () {
    };
    return TopToolbarComponent;
}());
TopToolbarComponent = __decorate([
    core_1.Component({
        moduleId: path.relative(__dirname, __filename),
        selector: 'top-toolbar',
        templateUrl: './_top-toolbar.view.html',
    })
], TopToolbarComponent);
exports.TopToolbarComponent = TopToolbarComponent;
