"use strict";
///<reference path='../../../node_modules/immutable/dist/immutable.d.ts'/>
var builder = require("fluent-interface-builder");
var Immutable = require("immutable");
var datamodel_ts_1 = require("../../../common/lib/datamodel-ts");
var index_1 = require("../../../common/lib/datamodel-ts/index");
//
// Generic Helper Methods
//
// const unwrapHelper = <T>(): (T)=>T => { return _.identity; };
// interface NoArgConstructor<T>
// { new (): T;
// }
//
// // Marker interface for any collection of methods that provide construction semantics
// // for an immutable data model object.
// interface ModelBuilder<T, M extends ModelBuilder<T, M>>
// {
// }
// ;
//
// // Marker interface that augments a collection of methods that provide construction
// // semantics with an additional method to perform the described construction.
// interface Wrapper<T, M extends ModelBuilder<T,M>> extends ModelBuilder<T,M>
// {
//   unwrap(): T;
// }
//
// // Named signature for a method that takes a ModelBuilder and uses it to define how a
// // desired object is to be constructed.
// type Director<T, M extends ModelBuilder<T, M>> = (builder: ModelBuilder<T,M>) => void;
//
// // Named signature for a method that takes a Director, calls it with a ModelBuilder
// // matching its signature requirements, and uses the work the Director does on that
// // ModelBuilder to return an instance of what the Director described to caller.
// type BuildMethod<T, M extends ModelBuilder<T, M>> = (director: Director<T, M>) => T;
//
// function unwrapHelper<T>(): (T) => T { return _.identity; }
//
// // Helper function that implements the recurring pattern of creating a builder method
// function buildMethodFactory<T,M extends ModelBuilder<T,M>, W extends Wrapper<T,M>>(
//   wrapperBuilder: Builder<W,T>, ctor: NoArgConstructor<T>
// ): BuildMethod<T,M> {
//   return (director: Director<T, M>): T => {
//     let wrapper: W = wrapperBuilder.value(new ctor());
//     director(wrapper);
//     return wrapper.unwrap();
//   };
// }
//
// Wrapper Implementations
//
var wrapNavbarData = builder.build()
    .chain('brandName', function (brandName) { return function (context) {
    return Object.assign(new NavbarData(), context, { brandName: brandName });
}; })
    .chain('addTab', function (displayName, routerLink) { return function (context) {
    return Object.assign(new NavbarData(), context, {
        tabs: context.tabs.push(Object.assign(new NavbarTabData(), {
            displayName: displayName, routerLink: routerLink
        }))
    });
}; })
    .unwrap('unwrap', datamodel_ts_1.unwrapHelper);
var wrapNavbarTabData = builder.build()
    .chain('displayName', function (displayName) { return function (context) {
    return Object.assign(new NavbarTabData(), { displayName: displayName });
}; })
    .chain('routerLink', function (routerLink) { return function (context) {
    return Object.assign(new NavbarTabData(), { routerLink: routerLink });
}; })
    .unwrap('unwrap', datamodel_ts_1.unwrapHelper);
var wrapNavbarDataTwo = builder.build()
    .chain('brandName', function (brandName) { return function (context) {
    return Object.assign(new NavbarData(), context, { brandName: brandName });
}; })
    .chain('addTab', function (director) { return function (context) {
    var wrapper = wrapNavbarTabData.value(new NavbarTabData());
    director(wrapper);
    return Object.assign(new NavbarData(), context, {
        tabs: context.tabs.push(wrapper.unwrap())
    });
}; })
    .unwrap('unwrap', datamodel_ts_1.unwrapHelper);
//
// Data Models
//
var NavbarData = (function () {
    function NavbarData() {
        this.tabs = Immutable.List();
    }
    NavbarData.build = function (director) {
        var wrapper = wrapNavbarData.value(new NavbarData());
        director(wrapper);
        return wrapper.unwrap();
    };
    NavbarData.prototype.copy = function (director) {
        var wrapper = wrapNavbarData.value(this);
        director(wrapper);
        return wrapper.unwrap();
    };
    return NavbarData;
}());
exports.NavbarData = NavbarData;
NavbarData.build2 = index_1.buildMethodFactory(wrapNavbarData, NavbarData);
var NavbarTabData = (function () {
    function NavbarTabData() {
    }
    NavbarTabData.prototype.copy = function (director) {
        var wrapper = wrapNavbarTabData.value(this);
        director(wrapper);
        return wrapper.unwrap();
    };
    return NavbarTabData;
}());
exports.NavbarTabData = NavbarTabData;
NavbarTabData.build = index_1.buildMethodFactory(wrapNavbarTabData, NavbarTabData);
