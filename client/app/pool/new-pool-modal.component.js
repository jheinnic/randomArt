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
var Observable_1 = require("rxjs/Observable");
var NewPoolModalComponent = (function () {
    function NewPoolModalComponent(modalRef, chainSelectSvc, poolApi) {
        this.modalRef = modalRef;
        this.chainSelectSvc = chainSelectSvc;
        this.poolApi = poolApi;
        lb_config_1.LoopBackConfig.setBaseURL(base_url_values_1.BASE_URL);
        lb_config_1.LoopBackConfig.setApiVersion(base_url_values_1.API_VERSION);
        this.newPool = {
            name: "string"
        };
    }
    ;
    NewPoolModalComponent.prototype.isSelectedChain = function (chainModel) {
        return this.chainSelectSvc.selected !== chainModel;
    };
    NewPoolModalComponent.prototype.selectChain = function (chainModel) {
        this.chainSelectSvc.selected = chainModel;
    };
    // This close function doesn't need to use jQuery or bootstrap, because
    // the button has the 'data-dismiss' attribute.
    NewPoolModalComponent.prototype.create = function () {
        var _this = this;
        return this.poolApi.create(this.newPool)
            .subscribe(function (poolData) {
            _this.modalRef.close(poolData);
            return poolData;
        }, function (error) {
            console.error("Failed to create pool with " + _this.newPool + " model.", error);
            // TODO: Keep the modal open and display the error there
            _this.showError(error);
            return Observable_1.Observable.throw(error);
        });
    };
    NewPoolModalComponent.prototype.showError = function (error) {
        this.error = error;
    };
    NewPoolModalComponent.prototype.hideError = function () {
        this.error = null;
    };
    return NewPoolModalComponent;
}());
NewPoolModalComponent = __decorate([
    core_1.Component({
        selector: 'new-pool-modal',
        templateUrl: './_new-pool-modal.view.html'
    })
], NewPoolModalComponent);
exports.NewPoolModalComponent = NewPoolModalComponent;
