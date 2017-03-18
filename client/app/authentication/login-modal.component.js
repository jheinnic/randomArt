"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var lb_config_1 = require("../shared/sdk/lb.config");
var base_url_values_1 = require("../shared/base-url.values");
var LoginModalComponent = (function () {
    function LoginModalComponent(modalRef, userApi, location) {
        this.modalRef = modalRef;
        this.userApi = userApi;
        this.location = location;
        this.cred = {
            username: null, password: null
        };
        lb_config_1.LoopBackConfig.setBaseURL(base_url_values_1.BASE_URL);
        lb_config_1.LoopBackConfig.setApiVersion(base_url_values_1.API_VERSION);
        this.cred = { username: null, password: null };
    }
    // This close function doesn't need to use jQuery or bootstrap, because
    // the button has the 'data-dismiss' attribute.
    LoginModalComponent.prototype.login = function () {
        var _this = this;
        return this.userApi.login(this.cred, undefined, true)
            .subscribe(function (userData) {
            var userInfo = _this.extractProfile(userData);
            console.log("Logged in as ", userInfo);
            _this.modalRef.close(userInfo);
            return userInfo;
        }, function (error) {
            console.error("Failed to login with " + _this.cred, error);
            // TODO: Keep the modal open and display the error there
            _this.showError(error);
            return Observable_1.Observable.throw(error);
        });
    };
    LoginModalComponent.prototype.extractProfile = function (userData) {
        var firstName = '';
        var lastName = '';
        var photo = '';
        var email = '';
        if (userData && userData.identities && userData.identities[0] && userData.identities[0].profile) {
            var profile = userData.identities[0].profile;
            var name_1 = profile.name;
            if (profile.photos && profile.photos[0] && profile.photos[0].value) {
                var photo_1 = profile.photos[0].value;
            }
            if (profile.emails && profile.emails[0] && profile.emails[0].value) {
                var email_1 = profile.emails[0].value;
            }
        }
        return {
            id: userData.id,
            firstName: firstName,
            lastName: lastName,
            photo: photo,
            email: email
        };
    };
    LoginModalComponent.prototype.showError = function (error) {
        this.error = error;
    };
    LoginModalComponent.prototype.hideError = function () {
        this.error = null;
    };
    LoginModalComponent.prototype.register = function () {
        // alert('TBD: Registration not yet implemented!');
        var result = {
            status: 'register', key: null, userId: null
        };
        // Now call close, returning control to the caller.
        this.modalRef.close(result);
    };
    LoginModalComponent.prototype.forgotUsername = function () {
        // alert('TBD: Registration not yet implemented!');
        var result = {
            status: 'forgotUsername', key: null, userId: null
        };
        // Now call close, returning control to the caller.
        this.modalRef.close(result);
    };
    LoginModalComponent.prototype.forgotPassword = function () {
        // alert('TBD: Registration not yet implemented!');
        var result = {
            status: 'forgotPassword', key: null, userId: this.cred.username
        };
        // Now call close, returning control to the caller.
        this.modalRef.close(result);
    };
    return LoginModalComponent;
}());
LoginModalComponent = __decorate([
    core_1.Component({
        selector: 'login-modal',
        templateUrl: './_login-modal.view.html'
    })
], LoginModalComponent);
exports.LoginModalComponent = LoginModalComponent;
