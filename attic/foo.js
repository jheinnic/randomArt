"use strict";
var _this = this;
var Foo = (function () {
    function Foo() {
    }
    Foo.prototype.fum = function () {
        var retVal = '';
        for (var ii = 0; ii < this.fee; ii++) {
            retVal += this.fi;
        }
        return retVal;
    };
    Foo.prototype.boo = function () {
        return this.moo(this.fee);
    };
    Foo.prototype.moo = function (count) {
        var retVal = '';
        for (var ii = 0; ii < count; ii++) {
            retVal += this.fi;
        }
        return retVal;
    };
    return Foo;
}());
exports.Foo = Foo;
var foo = new Foo();
var bar = foo;
foo.fee = 4;
foo.fi = "Hello";
console.log(foo);
console.log(foo.fum);
console.log(foo.fum());
console.log(foo.boo());
console.log(foo.moo(2));
console.log(bar);
console.log(bar.fum);
console.log(bar.fum());
console.log(bar.boo());
console.log(bar.moo(2));
var bee = {
    fee: 3,
    fi: "bart",
    fo: undefined
};
console.log(bee);
var baz = {
    fee: 3,
    fi: "bart",
    fo: undefined,
    fum: function () { return _this.fi; },
    boo: function () { return "this"; }
};
console.log(baz);
console.log(baz.fum());
console.log(baz.boo());
console.log(baz.moo ? baz.moo(2) : undefined);
