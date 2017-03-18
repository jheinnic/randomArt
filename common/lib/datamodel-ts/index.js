"use strict";
///<reference path='../../../node_modules/immutable/dist/immutable.d.ts'/>
var builder = require("fluent-interface-builder");
var decorators_1 = require("@angular/core/src/util/decorators");
// Marker interface that augments a collection of methods that provide construction
// semantics with an additional method to perform the described construction.
// export interface Wrapper<T, M extends ModelBuilder<T,M>> extends ModelBuilder<T,M> {
//   unwrap(): T;
// }
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
function oldCopyMethodFactory(self, wrapperBuilder) {
    return function (director) {
        var wrapper = wrapperBuilder.value(self);
        director(wrapper);
        return wrapper.unwrap();
    };
}
exports.oldCopyMethodFactory = oldCopyMethodFactory;
function copyMethodFactory(wrapperBuilder) {
    return function (director) {
        var wrapper = wrapperBuilder.value(this);
        director(wrapper);
        return wrapper.unwrap();
    };
}
exports.copyMethodFactory = copyMethodFactory;
function copyMethod(self, wrapperBuilder, director) {
    var wrapper = wrapperBuilder.value(self);
    director(wrapper);
    return wrapper.unwrap();
}
exports.copyMethod = copyMethod;
// export function aderiveFactoryWrapper(sample: Buildable<T>): FactoryWrapper<ReflectiveFluentBuilder<T>> {
//   return Object.keys(sample)
//     .reduce();
// }
function deriveFactoryWrapper(sample) {
    ///export function deriveFactoryWrapper<T extends Buildable<T>> (sample: T):
    // Builder<FactoryWrapper<T,ReflectiveFluentBuilder<T>>,T> {
    var retVal = builder.build();
    Object.keys(sample).forEach(
    // (wrapper: Builder<FactoryWrapper<ReflectiveFluentBuilder<T>,T>,T>,
    function (key) {
        if (key !== 'unwrap') {
            retVal = retVal.chain(key, function (value) { return function (context) { return Object.assign({}, context, { key: value }); }; });
        }
    });
    return retVal.unwrap('unwrap', unwrapHelper);
}
exports.deriveFactoryWrapper = deriveFactoryWrapper;
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
exports.Collection = (decorators_1.makePropDecorator('Collection', []));
