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
/* tslint:disable */
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var login_modal_component_1 = require("./login-modal.component");
var Observable_1 = require("rxjs/Observable");
/**
 * Login-redirecting error handler
 */
var RedirectingErrorHandler = (function () {
    function RedirectingErrorHandler(dialogService) {
        this.dialogService = dialogService;
    }
    RedirectingErrorHandler.prototype.handleError = function (error) {
        var _this = this;
        console.error("I am handling: ", error);
        if (error.status == 401) {
            this.loginModalRef = this.dialogService.open(login_modal_component_1.LoginModalComponent, { disableClose: false });
            this.loginModalRef.afterClosed().subscribe(function (value) { _this.loginModalRef = undefined; }, function (error) { _this.loginModalRef = undefined; }, function () { _this.loginModalRef = undefined; });
            return Observable_1.Observable.empty();
        }
        else {
            return Observable_1.Observable.throw(error.json().error || 'Server error');
        }
    };
    return RedirectingErrorHandler;
}());
RedirectingErrorHandler = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(material_1.MdDialog))
], RedirectingErrorHandler);
exports.RedirectingErrorHandler = RedirectingErrorHandler;
