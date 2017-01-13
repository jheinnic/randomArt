///<reference path='../../../node_modules/immutable/dist/immutable.d.ts'/>
import builder = require('fluent-interface-builder');
import {unwrapHelper, buildMethodFactory, ModelBuilder, Wrapper} from "../../../common/lib/datamodel-ts";
import Immutable = require('immutable');
import _ = require('lodash');

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

const wrapNavbarData = builder.build<NavbarDataWrapper,NavbarData>()
  .chain('brandName', (brandName: string) => (context: NavbarData) => {
    return Object.assign(new NavbarData(), context, {brandName: brandName}) as NavbarData;
  })
  .chain('addTab', (
    displayName: string, routerLink: string, isDefault: boolean = false
  ) => (context: NavbarData) => {
    let tabs = context.tabs;
    if (isDefault) {
      let oldDefault = tabs.findKey(function (val) { return val.isDefault;});
      if (typeof oldDefault === 'object') {
        tabs = tabs.set(oldDefault[0], Object.assign(new NavbarTabData(), oldDefault[1], {isDefault: false}));
      }
    }

    let entry = tabs.findKey(function (val) { return val.displayName === displayName; });
    if (typeof entry === 'object') {
      tabs = tabs.set(entry[0], Object.assign(new NavbarTabData(), {
        displayName: displayName,
        routerLink: routerLink,
        isDefault: isDefault
      }) as NavbarTabData);
    } else {
      tabs = tabs.push(Object.assign(new NavbarTabData(), {
        displayName: displayName,
        routerLink: routerLink,
        isDefault: isDefault
      }) as NavbarTabData);
    }
    return Object.assign(new NavbarData(), context, {tabs: tabs}) as NavbarData;
  })
  .chain('resetTabs', () => (context: NavbarData) => {
    return Object.assign(new NavbarTabData(), context, {tabs: []});
  })
  .chain('addMenuNav', (
    displayName: string, director: MenuNavDataDirector
  ) => (context: NavbarData) => {
    let wrapper: MenuNavDataWrapper = wrapMenuNavData.value(new MenuNavData());

    director(wrapper as MenuNavDataModelBuilder);

    return Object.assign(new NavbarData(), context, {
      menuItems: context.menuItems.push(wrapper.unwrap() as MenuNavData)
    } as NavbarData);
  })
  .chain('editMenuNav', (
    displayName: string, director: MenuNavDataDirector
  ) => (context: NavbarData) => {
    // TODO
    let wrapper: MenuNavDataWrapper = wrapMenuNavData.value(new MenuNavData());

    director(wrapper as MenuNavDataModelBuilder);

    return Object.assign(new NavbarData(), context, {
      menuItems: context.menuItems.push(wrapper.unwrap() as MenuNavData)
    } as NavbarData);
  })
  .chain('deleteMenuNav', (displayName: string) => (context: NavbarData) => {
    return Object.assign(new NavbarData(), context, {
      menuItems: context.menuItems.filter( function(nextItem) {
        return nextItem.displayName != displayName;
      })
    });
  }).unwrap('unwrap', unwrapHelper);


const wrapNavbarTabData = builder.build<NavbarTabDataWrapper,NavbarTabData>()
  .chain('displayName', (displayName: string) => (context: NavbarTabData) => {
    return Object.assign(new NavbarTabData(), {displayName: displayName});
  })
  .chain('routerLink', (routerLink: string) => (context: NavbarTabData) => {
    return Object.assign(new NavbarTabData(), {routerLink: routerLink});
  })
  .unwrap('unwrap', unwrapHelper);


const wrapNavbarDataTwo = builder.build<NavbarDataTwoWrapper,NavbarData>()
  .chain('brandName', (brandName: string) => (context: NavbarData) => {
    return Object.assign(new NavbarData(), context, {brandName: brandName}) as NavbarData;
  })
  .chain('addTab', (director: NavbarTabDataDirector) => (context: NavbarData) => {
    let wrapper: NavbarTabDataWrapper = wrapNavbarTabData.value(new NavbarTabData());

    director(wrapper as NavbarTabDataModelBuilder);

    return Object.assign(new NavbarData(), context, {
      tabs: context.tabs.push(wrapper.unwrap())
    }) as NavbarData;
  })
  .unwrap('unwrap', unwrapHelper);


let wrapMenuNavData = builder.build<MenuNavDataWrapper, MenuNavData>()
  .chain('routerLink', (routerLink: string) => (context: MenuNavData) => {
    return new MenuNavData(context, {routerLink: routerLink});
  })
  .chain('disabled', (disabled: boolean) => (context: MenuNavData) => {
    return new MenuNavData(context, {disabled: disabled});
  })
  .chain('orderRank', (orderRank: number) => (context: MenuNavData) => {
    return new MenuNavData(context, {orderRank: orderRank});
  })
  .chain('iconName', (iconName: string) => (context: MenuNavData) => {
    return new MenuNavData(context, {iconName: iconName});
  })
  .unwrap('unwrap', unwrapHelper);


//
// Data Models
//

export class NavbarData
{
  readonly brandName: string;
  readonly tabs: Immutable.List<NavbarTabData> = Immutable.List<NavbarTabData>();
  readonly menuItems: Immutable.List<MenuNavData> = Immutable.List<MenuNavData>();

  static build(director: NavbarDataDirector) {
    let wrapper: NavbarDataWrapper = wrapNavbarData.value(new NavbarData());

    director(wrapper);

    return wrapper.unwrap();
  }

  static build2 = buildMethodFactory(wrapNavbarData, NavbarData);

  copy(director: NavbarDataDirector) {
    let wrapper: NavbarDataWrapper = wrapNavbarData.value(this);

    director(wrapper);

    return wrapper.unwrap();

  }
}


export class NavbarTabData
{
  readonly displayName: string;
  readonly routerLink: string;
  readonly isDefault: boolean;

  static build = buildMethodFactory(wrapNavbarTabData, NavbarTabData);

  copy(director: NavbarTabDataDirector) {
    let wrapper: NavbarTabDataWrapper = wrapNavbarTabData.value(this);

    director(wrapper);

    return wrapper.unwrap();
  }
}

export type MenuNavDataType = {
  displayName?: string;
  routerLink?: string;
  disabled?: boolean;
  orderRank?: number;
  iconName?: string;
}

export class MenuNavData
{
  readonly displayName: string;
  readonly routerLink: string;
  readonly disabled: boolean;
  readonly orderRank: number;
  readonly iconName: string;

  constructor(predecessor?: MenuNavData, data?: MenuNavDataType) {
    Object.assign(this, predecessor || {}, data || {});
  }
}

//
// Director types
//

export type NavbarDataDirector = (builder: NavbarDataModelBuilder) => void;

export type MenuNavDataDirector = (builder: MenuNavDataModelBuilder) => void;

type NavbarTabDataDirector = (builder: NavbarTabDataModelBuilder) => void;


//
// Wrapper types
//

type NavbarDataWrapper =
  {
    brandName(brandName: string): NavbarDataWrapper;
    addTab(displayName: string, routerLink: string, isDefault: boolean): NavbarDataWrapper;
    resetTabs(): NavbarDataWrapper;
    addMenuNav(displayName: string, director: MenuNavDataDirector): NavbarDataWrapper;
    editMenuNav(displayName: string, director: MenuNavDataDirector): NavbarDataWrapper;
    removeMenuNav(displayName: string): NavbarDataWrapper;
    unwrap(): NavbarData;
  }

type MenuNavDataWrapper = {
  routerLink(routerLink: string): MenuNavDataWrapper;
  disabled(disabled: boolean): MenuNavDataWrapper;
  orderRank(orderRank: number): MenuNavDataWrapper;
  iconName(iconName: string): MenuNavDataWrapper;
  unwrap(): MenuNavData;
}

type NavbarTabDataWrapper =
  {
    displayName(displayName: string): NavbarTabDataWrapper;
    routerLink(routerLink: string): NavbarTabDataWrapper;
    unwrap(): NavbarTabData;
  }

type NavbarDataTwoWrapper =
  {
    brandName(brandName: string): NavbarDataTwoWrapper;
    addTab(NavbarTabDataDirector): NavbarDataTwoWrapper;
    unwrap(): NavbarData;
  }


//
// Builder Interfaces
//

export interface NavbarDataModelBuilder extends ModelBuilder<NavbarData, NavbarDataModelBuilder>
{
  brandName(brandName: string): NavbarDataModelBuilder;
  addTab(displayName: string, routerLink: string, isDefault: boolean): NavbarDataModelBuilder;
  resetTabs(): NavbarDataModelBuilder;
  addMenuNav(displayName: string, director: MenuNavDataDirector): NavbarDataModelBuilder;
  editMenuNav(displayName: string, director: MenuNavDataDirector): NavbarDataModelBuilder;
  removeMenuNav(displayName): NavbarDataModelBuilder;
}

export interface MenuNavDataModelBuilder extends ModelBuilder<MenuNavData, MenuNavDataModelBuilder>
{
  routerLink(routerLink: string): MenuNavDataModelBuilder;
  disabled(disabled: boolean): MenuNavDataModelBuilder;
  orderRank(orderRank: number): MenuNavDataModelBuilder;
  iconName(iconName: string): MenuNavDataModelBuilder;
}
;

interface NavbarTabDataModelBuilder extends ModelBuilder<NavbarTabData, NavbarTabDataModelBuilder>
{
  displayName(displayName: string): NavbarTabDataModelBuilder;
  routerLink(routerLink: string): NavbarTabDataModelBuilder;
}

interface NavbarDataModelBuilderTwo extends ModelBuilder<NavbarData, NavbarDataModelBuilderTwo>
{
  brandName(brandName: string): NavbarDataModelBuilderTwo;
  addTab(NavbarTabDataDirector): NavbarDataModelBuilderTwo;
}

