"use strict";
var Thing = (function () {
    function Thing(name) {
        this.name = name;
    }
    return Thing;
}());
exports.Thing = Thing;
var Utils = (function () {
    function Utils() {
    }
    Utils.foo = function (self) {
        return self.name;
    };
    Utils.bar = function (self, count) {
        var retVal = '';
        for (var ii = 0; ii < count; ii++) {
            retVal += self.name;
        }
        return retVal;
    };
    return Utils;
}());
exports.Utils = Utils;
var it = new Thing('it');
console.log(it);
console.log(Utils.foo(it));
console.log(Utils.bar(it, 2));
