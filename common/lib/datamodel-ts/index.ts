///<reference path='../../../node_modules/immutable/dist/immutable.d.ts'/>
import builder = require('fluent-interface-builder');
import {Builder} from "fluent-interface-builder";
import {makeDecorator, makePropDecorator} from "@angular/core/src/util/decorators";

// From the standard library....
export type Partial<T> = { [P in keyof T]?: T[P]; }
export type Readonly<T> = { readonly [P in keyof T]: T[P]; }
export type Nullable<T> = { [P in keyof T]: T[P] | null; }

export type Pick<T, K extends keyof T> = { [P in K]: T[P]; }
export type PartialPick<T, K extends keyof T> = Pick<T,K> & Partial<T>

export type Record<K extends string, T> = { [P in K]: T; }
export type Flags<K extends string> = Record<K, boolean>
export type KeyPairs<T extends string> = Record<T, T> // { [P in T]: T }

export type KeyToValue<T extends string> = { [P in T]: P }
//
// Generic Helper Methods
//

// const unwrapHelper = <T>(): (T)=>T => { return _.identity; };

export interface NoArgConstructor<T> {
  new (): T;
}

export interface PartialConstructor<T> {
  new (previous?: T, template?: Partial<T>): T;
}

// Marker interface for any collection of methods that provide construction semantics
// for an immutable data model object.  This library contains utility classes that facilitate
// using such an interface to drive the cloning and construction of immutable artifacts
// with a fluent coding style.
// export interface ModelBuilder<T> { }
export type FluentBuilder<M> = { [K in keyof M]: (...params: any[]) => M };
export type FactoryWrapper<T, M> = FluentBuilder<M> & Wrapper<T>;
export interface Wrapper<T> { unwrap(): T; }


// Named signature for a method that takes a ModelBuilder and uses it to define how a
// desired object is to be constructed.
export type Director<M> = (builder:FluentBuilder<M>) => void;

// Named signature for a method that takes a Director, calls it with a ModelBuilder
// matching its signature requirements, and uses the work the Director does on that
// ModelBuilder to return an instance of what the Director described to caller.
export type BuildMethod<T, M> = (director:Director<M>) => T;

export type CopyMethod<T, M> = (director:Director<M>) => T;

// Marker interface that augments a collection of methods that provide construction
// semantics with an additional method to perform the described construction.
// export interface Wrapper<T, M extends ModelBuilder<T,M>> extends ModelBuilder<T,M> {
//   unwrap(): T;
// }


export function unwrapHelper<T>(): (T:T)=>T { return (self:T) => { return self; }; }

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
export function buildMethodFactory<T, M extends FluentBuilder<M>, W extends FactoryWrapper<T,M>>(
  wrapperBuilder:Builder<W,Partial<T>>, ctor:NoArgConstructor<T>
) : BuildMethod<T,M> {
  return (director:Director<M>): T => {
    let wrapper:W = wrapperBuilder.value(new ctor());
    director(wrapper);
    return wrapper.unwrap();
  };
}

export function oldCopyMethodFactory<T,M extends FluentBuilder<M>, W extends FactoryWrapper<T,M>>(
  self: T, wrapperBuilder:Builder<W,Partial<T>>
) : BuildMethod<T,M> {
  return function (director:Director<M>): T {
    let wrapper:W = wrapperBuilder.value(self);
    director(wrapper);
    return wrapper.unwrap();
  };
}

export function copyMethodFactory<T,M extends FluentBuilder<M>, W extends FactoryWrapper<T,M>>(
  wrapperBuilder:Builder<W,Partial<T>>
) : CopyMethod<T,M> {
  return function (director:Director<M>): T {
    let wrapper:W = wrapperBuilder.value(this);
    director(wrapper);
    return wrapper.unwrap();
  };
}

export function copyMethod<T,M extends FluentBuilder<M>, W extends FactoryWrapper<T,M>>(
  self: T, wrapperBuilder:Builder<W,Partial<T>>, director: Director<M>
) : T {
  let wrapper:W = wrapperBuilder.value(self);
  director(wrapper);
  return wrapper.unwrap();
}

type Value = string | number | boolean;

export type Buildable<T> =
  { [K in keyof T]: Value | Buildable<any> | Immutable.List<Value> | Immutable.List<Buildable<any>>; };

/*
export type Editable<T> =
  { [K in keyof T]: Value| Buildable<any> | Immutable.List<Value> |
    // Immutable.List[Buildable<any>]; }
  & { id: Value; };
 */

export type Functionized<T> = {
  [K in keyof T]: (param: any) => any // T[K]) => any
};

export type ReflectiveFluentBuilder<T extends Buildable<T>> = FluentBuilder<Functionized<T>> & {
  [K in keyof T]: (param: any) => any // T[K]) => FluentBuilder<Functionized<T>>;
}

export type ReflectiveBuilder<T extends Buildable<T>> = Builder<FactoryWrapper<T, ReflectiveFluentBuilder<T>>,Partial<T>>;

type Keys<T> = keyof T;

// export function aderiveFactoryWrapper(sample: Buildable<T>): FactoryWrapper<ReflectiveFluentBuilder<T>> {
//   return Object.keys(sample)
//     .reduce();
// }

export function deriveFactoryWrapper<T extends Buildable<T>>(sample: Keys<T>[] = []): ReflectiveBuilder<T> {
  let retVal = builder.build<FactoryWrapper<T,ReflectiveFluentBuilder<T>>,Partial<T>>();

  // let targetKeys: Keys<T>[];
  // if (sample.length === 0) {
  //   targetKeys = Object.keys(T);
  // } else {
  //   targetKeys = sample;
  // }

  sample.forEach(
    (key:keyof T) => {
      if (key !== 'unwrap') {
        retVal = retVal.cascade(key, (value) => (context: Partial<T>) => {
          let tempVal = {} as Partial<T>;
          tempVal[key] = value;
          Object.assign(context, tempVal);
        })
      }
    }
  );

  return retVal.unwrap('unwrap', unwrapHelper);
}


//
// Experimental: ES7 annotation-driven behavior
//
/**
 * DataModel decorator and default metadata.
 *
 * @Annotation
 */
export const /** @type {?} */ DataModel = (makeDecorator('DataModel', {
  name: undefined,
  builder: "default"
}));

/**
 * Collection decorator and default metadata.
 *
 * @Annotation
 */
export const /** @type {?} */ Collection = (makePropDecorator('Collection', []));
