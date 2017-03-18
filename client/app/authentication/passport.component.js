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
/**
 * Created by jheinnic on 1/14/17.
 */
var core_1 = require("@angular/core");
var keys_dictionary_1 = require("../shared/keys/keys.dictionary");
var path = require("path");
var PassportComponent = (function () {
    function PassportComponent(auth, userApi, route, router, authHomeUrl) {
        var _this = this;
        this.auth = auth;
        this.userApi = userApi;
        this.route = route;
        this.router = router;
        this.authHomeUrl = authHomeUrl;
        // this.route.params.subscribe((token: SDKToken) => {
        this.routeSubscription = this.route.params.subscribe(function (tokenKeys) {
            console.log('Passport params retrieved for ' + JSON.stringify(tokenKeys));
            var issueDate = new Date();
            var tokenData = {
                id: tokenKeys.tokenId,
                userId: tokenKeys.userId,
                created: issueDate,
                issuedAt: issueDate,
                rememberMe: false,
                ttl: 1209600,
                user: {}
            };
            auth.setUser(tokenData);
            _this.lookupSubscription = userApi.findById(tokenKeys.userId, { include: "identities" })
                .subscribe(function (userData) {
                console.log('Lookup from params yields: ' + JSON.stringify(userData));
                if (userData) {
                    tokenData.user = userData;
                    _this.auth.setUser(tokenData);
                    _this.auth.save();
                    _this.router.navigate([authHomeUrl]);
                }
                else {
                    _this.router.navigate(['/login']);
                }
            }, function (err) { console.error(err); }, function () { _this.lookupSubscription = null; });
        }, function (err) { console.error(err); }, function () { _this.routeSubscription = null; });
    }
    PassportComponent.prototype.ngOnDestroy = function () {
        if (this.lookupSubscription) {
            this.lookupSubscription.unsubscribe();
        }
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
    };
    return PassportComponent;
}());
PassportComponent = __decorate([
    core_1.Component({
        moduleId: path.resolve(__dirname, __filename),
        template: '&nbsp;'
    }),
    __param(4, core_1.Inject(keys_dictionary_1.DIKeys.authHomeRoute))
], PassportComponent);
exports.PassportComponent = PassportComponent;
