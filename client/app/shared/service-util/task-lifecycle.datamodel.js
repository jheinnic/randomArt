"use strict";
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
exports.TaskStage = {
    pending: 'pending',
    active: 'active',
    done: 'done',
    suspended: 'suspended',
    abandoned: 'abandoned',
    retryable: 'retryable',
    failed: 'failed',
    closed: 'closed'
};
/**
 * Abstract base class for a worker with a lifecycle, with a set of base properties that
 */
var AbstractTask = (function () {
    function AbstractTask(task) {
        this.task = task;
        this.myStage = 'pending';
        this.onTaskEvent = new BehaviorSubject_1.BehaviorSubject({
            kind: 'new',
            task: this.task
        });
    }
    AbstractTask.prototype.assertTransition = function (from, to) {
        var _this = this;
        if (this.myStage !== from) {
            throw new Error("Cannot transition from " + from + " while current state is " + this.myStage);
        }
        var nextEvent;
        switch (from + "->" + to) {
            case 'pending->active':
                nextEvent = { kind: 'began', task: this.task };
                break;
            case 'suspended->active':
                nextEvent = { kind: 'resumed', task: this.task };
                break;
            case 'active->suspended':
                nextEvent = { kind: 'paused', task: this.task };
                break;
            case 'active->abandoned':
                nextEvent = { kind: 'cancelled', task: this.task };
                break;
            case 'active->done':
                nextEvent = { kind: 'finished', task: this.task, result: this.result };
                break;
            case 'active->retryable':
                nextEvent = { kind: 'softError', task: this.task, error: this.error };
                break;
            case 'active->failed':
                nextEvent = { kind: 'hardError', task: this.task, error: this.error };
                break;
            case 'done->closed':
            case 'abandoned->closed':
            case 'retryable->closed':
            case 'failed->closed':
                nextEvent = { kind: 'acknowledged', task: this.task };
                break;
            case 'abandoned->pending':
            case 'retryable->pending':
                nextEvent = { kind: 'retried', task: this.task };
                break;
            default:
                // throw new Error(`Internal error task state changes from ${from} to ${to} are
                // undefined`);
                throw new Error("Cannot transition to " + to + " while current state is " + this.myStage);
        }
        setTimeout(function () {
            _this.myStage = to;
            _this.onTaskEvent.next(nextEvent);
        });
    };
    AbstractTask.prototype.begin = function () {
        this.assertTransition('pending', 'active');
    };
    AbstractTask.prototype.pause = function () {
        this.assertTransition('active', 'suspended');
    };
    AbstractTask.prototype.resume = function () {
        this.assertTransition('suspended', 'active');
    };
    AbstractTask.prototype.cancel = function () {
        this.assertTransition('active', 'abandoned');
    };
    AbstractTask.prototype.finish = function (result) {
        this.result = result;
        this.assertTransition('active', 'done');
    };
    AbstractTask.prototype.assert = function (error, retryable) {
        if (retryable === void 0) { retryable = false; }
        this.error = error;
        if (retryable) {
            this.assertTransition('active', 'retryable');
        }
        else {
            this.assertTransition('active', 'failed');
        }
    };
    AbstractTask.prototype.retry = function () {
        this.assertTransition('retryable', 'pending');
    };
    AbstractTask.prototype.acknowledge = function () {
        switch (this.myStage) {
            case 'done':
            case 'retryable':
            case 'failed':
            case 'abandoned':
                this.assertTransition(this.myStage, 'closed');
                break;
            default:
                throw new Error("Cannot transition to closed while current state is " + this.myStage);
        }
    };
    AbstractTask.prototype.report = function (progress) {
        var _this = this;
        if (this.myStage !== 'active') {
            throw new Error("Progress reports can only be emitted when a task is active, but task is " + this.myStage);
        }
        setTimeout(function () {
            _this.onTaskEvent.next({ kind: 'progress', task: _this.task, progress: progress });
        }, 0);
    };
    Object.defineProperty(AbstractTask.prototype, "stage", {
        get: function () {
            return this.myStage;
        },
        enumerable: true,
        configurable: true
    });
    AbstractTask.prototype.getEvents = function () {
        return this.onTaskEvent.asObservable().do(function (e) { console.log('Input Event: ', e); });
    };
    return AbstractTask;
}());
exports.AbstractTask = AbstractTask;
