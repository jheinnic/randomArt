///<reference path='../../../node_modules/immutable/dist/immutable.d.ts'/>
import builder = require('fluent-interface-builder');
import {Builder} from "fluent-interface-builder";

//
// Generic Helper Methods
//

// const unwrapHelper = <T>(): (T)=>T => { return _.identity; };

export interface NoArgConstructor<T> {
  new (): T;
}

// Marker interface for any collection of methods that provide construction semantics
// for an immutable data model object.
export interface ModelBuilder<T, M extends ModelBuilder<T, M>> { };

// Named signature for a method that takes a ModelBuilder and uses it to define how a
// desired object is to be constructed.
export type Director<T, M extends ModelBuilder<T, M>> = (builder:ModelBuilder<T,M>) => void;

// Named signature for a method that takes a Director, calls it with a ModelBuilder
// matching its signature requirements, and uses the work the Director does on that
// ModelBuilder to return an instance of what the Director described to caller.
export type BuildMethod<T, M extends ModelBuilder<T, M>> = (director:Director<T, M>) => T;

// Marker interface that augments a collection of methods that provide construction
// semantics with an additional method to perform the described construction.
export interface Wrapper<T, M extends ModelBuilder<T,M>> extends ModelBuilder<T,M> {
  unwrap(): T;
}

export function unwrapHelper<T>(): (T)=>T { return (self:T) => { return self; }; }

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
export function buildMethodFactory<T,M extends ModelBuilder<T,M>, W extends Wrapper<T,M>>(
  wrapperBuilder:Builder<W,T>, ctor:NoArgConstructor<T>
) : BuildMethod<T,M> {
  return (director:Director<T, M>): T => {
    let wrapper:W = wrapperBuilder.value(new ctor());
    director(wrapper);
    return wrapper.unwrap();
  };
}

export function copyMethodFactory<T,M extends ModelBuilder<T,M>, W extends Wrapper<T,M>>(
  wrapperBuilder:Builder<W,T>, self: T
) : BuildMethod<T,M> {
  return function (director:Director<T, M>): T {
    let wrapper:W = wrapperBuilder.value(self);
    director(wrapper);
    return wrapper.unwrap();
  };
}
