"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var http_1 = require("@angular/http");
var _home_1 = require("app/+home");
var _lobby_1 = require("app/+lobby");
var no_content_1 = require("app/no-content");
var app_component_1 = require("app/app.component");
var authentication_1 = require("app/authentication");
var authentication_2 = require("app/authentication");
var app_routes_1 = require("app/app.routes");
var sdk_1 = require("app/shared/sdk");
var core_2 = require("app/shared/sdk/services/core");
var custom_1 = require("app/shared/sdk/services/custom");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        declarations: [app_component_1.AppComponent, no_content_1.NoContentComponent, authentication_1.LoginModal],
        imports: [
            platform_browser_1.BrowserModule,
            common_1.CommonModule,
            http_1.HttpModule,
            forms_1.FormsModule,
            _home_1.HomeModule,
            _lobby_1.LobbyModule,
            router_1.RouterModule.forRoot(app_routes_1.routes),
            sdk_1.SDKBrowserModule.forRoot()
        ],
        providers: [
            { provide: core_2.ErrorHandler, useClass: authentication_2.RedirectingErrorHandler },
            { provide: custom_1.EmailApi, useClass: custom_1.EmailApi },
            { provide: custom_1.UserApi, useClass: custom_1.UserApi }
        ],
        entryComponents: [app_component_1.AppComponent, authentication_1.LoginModal],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//const appRoutes: Routes = [
//  { path: 'passport/:id/:userId', component: PassportComponent }
//];
