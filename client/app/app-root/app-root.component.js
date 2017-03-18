"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var lb_config_1 = require("../shared/sdk/lb.config");
var base_url_values_1 = require("../shared/base-url.values");
var material_1 = require("@angular/material");
var global_selection_service_1 = require("../shared/component-util/global-selection.service");
var AppRootComponent = (function () {
    function AppRootComponent(navbarDataService) {
        var _this = this;
        this.navbarDataService = navbarDataService;
        lb_config_1.LoopBackConfig.setBaseURL(base_url_values_1.BASE_URL);
        lb_config_1.LoopBackConfig.setApiVersion(base_url_values_1.API_VERSION);
        this.subscription = this.navbarDataService.navbarData.subscribe(function (data) {
            if (data) {
                _this.navbarData = data;
                if (_this.sideNavElem) {
                    if (data.sidenavOpen === true) {
                        _this.sideNavElem.open();
                    }
                    else {
                        _this.sideNavElem.close();
                    }
                }
                else {
                    console.warn('no visible sidenav controlers due to no internet');
                }
            }
        });
    }
    AppRootComponent.prototype.ngOnInit = function () {
        this.navbarDataService.updateNavbar(function (builder) {
            console.log("Creating Image Lab menu item");
            builder.brandName('JCH')
                .addMenuNav('Home', function (builder) {
                builder.routerLink('/home')
                    .iconName('home')
                    .orderRank(1);
            })
                .addMenuNav('Image Pools', function (builder) {
                builder.routerLink('/pools')
                    .iconName('format_paint')
                    .orderRank(2);
            })
                .addMenuNav('Events', function (builder) {
                builder.routerLink('/events')
                    .disabled(false)
                    .iconName('event')
                    .orderRank(3);
            })
                .addTab('Create', '/pools', false)
                .addTab('Explore', '/scroll', false)
                .addTab('Inspect', '/pointMaps', false)
                .addTab('Manage', '/home', false)
                .addTab('Assess', '/pools/1/images', false);
        });
    };
    AppRootComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    AppRootComponent.prototype.ngAfterViewInit = function () {
        if (this.sideNav) {
            var sideNavArray = this.sideNav.toArray();
            if (sideNavArray.length > 0) {
                var navbarData = this.navbarDataService.navbarData;
                this.sideNavElem = sideNavArray[0];
            }
        }
    };
    AppRootComponent.prototype.onActivate = function (anEvent) {
        console.log('On activate: ', anEvent);
    };
    AppRootComponent.prototype.onDeactivate = function (anEvent) {
        console.log('On deactivate: ', anEvent);
    };
    AppRootComponent.prototype.onSidenavOpened = function (event) {
        this.navbarDataService.updateNavbar(function (builder) { builder.openSidenav(); });
    };
    AppRootComponent.prototype.onSidenavClosed = function (event) {
        this.navbarDataService.updateNavbar(function (builder) { builder.closeSidenav(); });
    };
    AppRootComponent.prototype.isSideNavOpen = function () {
        return this.sideNav && this.sideNavElem && this.sideNavElem.opened;
    };
    return AppRootComponent;
}());
__decorate([
    core_1.ViewChildren(material_1.MdSidenav)
], AppRootComponent.prototype, "sideNav", void 0);
AppRootComponent = __decorate([
    core_1.Component({
        selector: "app-root",
        template: require("./_app-root.view.html"),
        providers: [global_selection_service_1.GlobalSelection]
    })
], AppRootComponent);
exports.AppRootComponent = AppRootComponent;
