"use strict";
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var AbstractSelection = (function () {
    function AbstractSelection() {
        this.selection = new BehaviorSubject_1.BehaviorSubject(undefined);
    }
    Object.defineProperty(AbstractSelection.prototype, "selected", {
        get: function () {
            return this.isSelected;
        },
        set: function (newTarget) {
            if (!newTarget) {
                throw new Error("Use clear() to purge a selection, not null or undefined.);");
            }
            if (this.isSelected !== newTarget) {
                this.isSelected = newTarget;
                this.selection.next(newTarget);
            }
        },
        enumerable: true,
        configurable: true
    });
    AbstractSelection.prototype.hasSelection = function () {
        return !!this.isSelected;
    };
    AbstractSelection.prototype.onSelect = function () {
        return this.selection.asObservable();
    };
    AbstractSelection.prototype.clear = function () {
        this.isSelected = undefined;
        this.selection.next(undefined);
    };
    AbstractSelection.prototype.ngOnDestroy = function () {
        this.isSelected = undefined;
        this.selection.complete();
    };
    return AbstractSelection;
}());
exports.AbstractSelection = AbstractSelection;
