"use strict";
/**
 * Created by jheinnic on 2/1/17.
 */
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Immutable = require("immutable");
var AbstractQueueService = (function () {
    function AbstractQueueService() {
        this.content = Immutable.List();
        this.changes = new BehaviorSubject_1.BehaviorSubject({
            kind: 'create',
            newContent: this.content
        });
    }
    AbstractQueueService.prototype.onChanged = function () {
        return this.changes.asObservable();
    };
    AbstractQueueService.prototype.offer = function (item) {
        this.content = this.content.push(item);
        this.changes.next({
            kind: 'offer',
            newContent: this.content,
            offeredItem: item
        });
    };
    AbstractQueueService.prototype.take = function () {
        var retVal = undefined;
        if (!this.content.isEmpty()) {
            retVal = this.content.first();
            this.content = this.content.unshift();
            this.changes.next({
                kind: 'take',
                newContent: this.content,
                takenItem: retVal
            });
        }
        return retVal;
    };
    AbstractQueueService.prototype.peek = function () {
        var retVal;
        if (!this.content.isEmpty()) {
            retVal = this.content.first();
        }
        return retVal;
    };
    AbstractQueueService.prototype.remove = function (index) {
        if (index < 0 || index >= this.content.size) {
            throw new Error('Index Out Of Bounds: ' + index);
        }
        var retVal = this.content.get(index);
        this.content = this.content.remove(index);
        this.changes.next({
            kind: 'remove',
            newContent: this.content,
            removedItem: retVal,
            removedIndex: index
        });
    };
    AbstractQueueService.prototype.replace = function (index, item) {
        if (index < 0 || index >= this.content.size) {
            throw new Error('Index Out Of Bounds: ' + index);
        }
        var retVal = this.content.get(index);
        this.content = this.content.remove(index);
        this.changes.next({
            kind: 'remove',
            newContent: this.content,
            removedItem: retVal,
            removedIndex: index
        });
    };
    AbstractQueueService.prototype.swap = function (firstIndex, secondIndex) {
        if ((firstIndex < 0) || (firstIndex >= this.content.size)) {
            throw new Error('Index Out Of Bounds: ' + firstIndex);
        }
        if ((secondIndex < 0) || (secondIndex >= this.content.size)) {
            throw new Error('Index Out Of Bounds: ' + secondIndex);
        }
        if (firstIndex !== secondIndex) {
            var first = this.content.get(firstIndex);
            var second = this.content.get(secondIndex);
            this.content = this.content.set(firstIndex, second);
            this.content = this.content.set(secondIndex, first);
            this.changes.next({
                kind: 'swap',
                newContent: this.content,
                firstItem: first,
                secondItem: second,
                firstIndex: firstIndex,
                secondIndex: secondIndex
            });
        }
    };
    AbstractQueueService.prototype.count = function () {
        return this.content.size;
    };
    return AbstractQueueService;
}());
exports.AbstractQueueService = AbstractQueueService;
