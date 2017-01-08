"use strict";
var decorators_1 = require("@angular/core/src/util/decorators");
;
function unwrapHelper() { return function (self) { return self; }; }
exports.unwrapHelper = unwrapHelper;
// Helper function that implements the recurring pattern of implementing a builder method
// that:
// 1)  Accepts a Director for some ModelBuilder interface
// 2)  Constructs a Wrapper that also implements ModelBuilder interface
// 3)  Invokes Director with constructed Wrapper as its ModelBuilder argument
// 4)  Uses Wrapper's additional unwrap() method to return constructed object to caller.
//
// This helper needs two arguments
// -- A preconfigured Builder from fluent-interface-builder that has been configured to
//    produce Wrappers that extend the required ModelBuilder API.
// -- A class the provided Builder is used to construct with a No-Argument constructor.
function buildMethodFactory(wrapperBuilder, ctor) {
    return function (director) {
        var wrapper = wrapperBuilder.value(new ctor());
        director(wrapper);
        return wrapper.unwrap();
    };
}
exports.buildMethodFactory = buildMethodFactory;
function copyMethodFactory(wrapperBuilder, self) {
    return function (director) {
        var wrapper = wrapperBuilder.value(self);
        director(wrapper);
        return wrapper.unwrap();
    };
}
exports.copyMethodFactory = copyMethodFactory;
//
// Experimental: ES7 annotation-driven behavior
//
/**
 * DataModel decorator and default metadata.
 *
 * @Annotation
 */
exports.DataModel = (decorators_1.makeDecorator('DataModel', {
    name: undefined,
    builder: "default"
}));
/**
 * Collection decorator and default metadata.
 *
 * @Annotation
 */
exports.Collection = (decorators_1.makePropDecorator('Collection', undefined));
