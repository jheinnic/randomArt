"use strict";
/**
 * Created by jheinnic on 2/2/17.
 */
var rxjs_1 = require("rxjs");
exports.ServiceStage = {
    offline: 'offline',
    available: 'available',
    busy: 'busy',
    zombie: 'zombie',
    stopped: 'stopped',
    failed: 'failed'
};
/**
 * Abstract base class for a worker with a lifecycle, with a set of base properties that
 * is the union of all event interface types.  This facilitates a pattern where changes in
 * lifecycle's state machine are coincident to immutable reconstruction.  This in turn
 * promotes use of the service worker's lifecycle state engine object itself as the lifecycle
 * event payload.
 */
var AbstractService = (function () {
    function AbstractService() {
        this.svcStage = 'offline';
        this.myEvents = new rxjs_1.BehaviorSubject({ kind: 'new' });
    }
    AbstractService.prototype.isAvailable = function () {
        return this.svcStage === exports.ServiceStage.available;
    };
    AbstractService.prototype.getStage = function () {
        return this.svcStage;
    };
    AbstractService.prototype.getEvents = function () {
        return this.myEvents.asObservable();
    };
    AbstractService.prototype.assertTransition = function (from, to) {
        var _this = this;
        if (this.svcStage !== from) {
            throw new Error("Cannot transition from " + from + " while current state is " + this.svcStage);
        }
        var nextEvent;
        switch (from + "->" + to) {
            case 'offline->available':
                nextEvent = { kind: 'launched' };
                break;
            case 'available->zombie':
            case 'busy->zombie':
                nextEvent = { kind: 'closed' };
                break;
            case 'available->busy':
                nextEvent = { kind: 'reserved' };
                break;
            case 'busy->available':
                nextEvent = { kind: 'released' };
                break;
            case 'zombie->stopped':
                nextEvent = { kind: 'shutDown' };
                break;
            case 'available->failed':
            case 'busy->failed':
            case 'zombie->failed':
                nextEvent = { kind: 'crashed', error: this.error };
                break;
            case 'stopped->offline':
            case 'failed->offline':
                nextEvent = { kind: 'reset' };
                break;
            default:
                throw new Error("Cannot transition to " + to + " while current state is " + this.svcStage);
        }
        setTimeout(function () {
            _this.svcStage = to;
            _this.myEvents.next(nextEvent);
        });
    };
    AbstractService.prototype.launch = function () {
        this.assertTransition('offline', 'available');
    };
    AbstractService.prototype.close = function () {
        if (this.svcStage === 'busy') {
            this.assertTransition('busy', 'zombie');
        }
        else {
            this.assertTransition('available', 'zombie');
        }
    };
    AbstractService.prototype.reserve = function () {
        this.assertTransition('available', 'busy');
    };
    AbstractService.prototype.release = function () {
        this.assertTransition('busy', 'available');
    };
    AbstractService.prototype.stop = function () {
        this.assertTransition('zombie', 'stopped');
    };
    AbstractService.prototype.assert = function (error) {
        this.error = error;
        this.assertTransition(this.svcStage, 'failed');
        this.error = undefined;
    };
    AbstractService.prototype.reset = function () {
        this.assertTransition(this.svcStage, 'offline');
    };
    return AbstractService;
}());
exports.AbstractService = AbstractService;
