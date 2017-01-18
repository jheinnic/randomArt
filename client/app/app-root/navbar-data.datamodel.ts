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
    return new NavbarData(context, {brandName: brandName});
  })
  .chain('openSidenav', () => (context: NavbarData) => {
    return new NavbarData(context, {sidenavOpen: true});
  })
  .chain('closeSidenav', () => (context: NavbarData) => {
    return new NavbarData(context, {sidenavOpen: false});
  })
  .chain('toggleSidenav', () => (context: NavbarData) => {
    return new NavbarData(context, {sidenavOpen: !context.sidenavOpen});
  })
  .chain('addTab', (
    displayName: string, routerLink: string, isDefault: boolean = false
  ) => (context: NavbarData) => {
    let tabs:Immutable.List<NavbarTabData> = context.tabs;
    if (isDefault) {
      let oldDefault = tabs.findEntry(function (val) { return val.isDefault;});
      if (! _.isUndefined(oldDefault)) {
        tabs = tabs.set(oldDefault[0], new NavbarTabData(oldDefault[1], {isDefault: false}));
      }
    }

    let entry = tabs.findEntry(function (val) { return val.displayName === displayName; });
    if (! _.isUndefined(entry)) {
      tabs = tabs.set(entry[0], new NavbarTabData(entry[1], {
        displayName: displayName,
        routerLink: routerLink,
        isDefault: isDefault
      }));
    } else {
      tabs = tabs.push(new NavbarTabData(undefined, {
        displayName: displayName,
        routerLink: routerLink,
        isDefault: isDefault
      }));
    }

    return new NavbarData(context, {tabs: tabs});
  })
  .chain('resetTabs', () => (context: NavbarData) => {
    return Object.assign(new NavbarTabData(), context, {tabs: []});
  })
  .chain('addMenuNav', (
    displayName: string, director: MenuNavDataDirector
  ) => (context: NavbarData) => {
    return Object.assign(new NavbarData(), context, {
      menuItems: context.menuItems.push(MenuNavData.build(director) as MenuNavData)
    } as NavbarData);
  })
  .chain('editMenuNav', (
    displayName: string, director: MenuNavDataDirector
  ) => (context: NavbarData) => {
    let entry = context.menuItems.findEntry((item) => {
      return item.displayName === displayName
    });

    // TODO: Handle error if displayName matches nothing

    return new NavbarData(context, {
      menuItems: context.menuItems.set(
        entry[0], entry[1].copy(director))
    });
  })
  .chain('deleteMenuNav', (displayName: string) => (context: NavbarData) => {
    return new NavbarData(context, {
      menuItems: context.menuItems.filter( function(nextItem) {
        return nextItem.displayName != displayName;
      }).toList()
    });
  }).unwrap('unwrap', unwrapHelper);


const wrapNavbarTabData = builder.build<NavbarTabDataWrapper,NavbarTabData>()
  .chain('displayName', (displayName: string) => (context: NavbarTabData) => {
    return new NavbarTabData(context, {displayName: displayName});
  })
  .chain('routerLink', (routerLink: string) => (context: NavbarTabData) => {
    return new NavbarTabData(context, {routerLink: routerLink});
  })
  .unwrap('unwrap', unwrapHelper);


const wrapNavbarDataTwo = builder.build<NavbarDataTwoWrapper,NavbarData>()
  .chain('brandName', (brandName: string) => (context: NavbarData) => {
    return new NavbarData(context, {brandName: brandName}) as NavbarData;
  })
  .chain('addTab', (director: NavbarTabDataDirector) => (context: NavbarData) => {
    let wrapper: NavbarTabDataWrapper = wrapNavbarTabData.value(new NavbarTabData());

    director(wrapper as NavbarTabDataModelBuilder);

    return new NavbarData(context, {
      tabs: context.tabs.push(wrapper.unwrap())
    });
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

export type NavbarDataType = {
  brandName?: string;
  sidenavOpen?: boolean;
  tabs?: Immutable.List<NavbarTabData>
  menuItems?: Immutable.List<MenuNavData>
}

export class NavbarData
{
  readonly brandName: string;
  readonly sidenavOpen: boolean;
  readonly tabs: Immutable.List<NavbarTabData> = Immutable.List<NavbarTabData>();
  readonly menuItems: Immutable.List<MenuNavData> = Immutable.List<MenuNavData>();

  constructor(predecessor?: NavbarData, data?: NavbarDataType) {
    Object.assign(this, predecessor || {}, data || {});
  }

  static build = buildMethodFactory(wrapNavbarData, NavbarData);

  // static build(director: NavbarDataDirector) {
  //   let wrapper: NavbarDataWrapper = wrapNavbarData.value(new NavbarData());
  //   director(wrapper);
  //   return wrapper.unwrap();
  // }

  copy(director: NavbarDataDirector) {
    let wrapper: NavbarDataWrapper = wrapNavbarData.value(this);
    director(wrapper);
    return wrapper.unwrap();
  }
}

export type NavbarTabDataType = {
  displayName?: string;
  routerLink?: string;
  isDefault?: boolean;
}

export class NavbarTabData
{
  readonly displayName: string;
  readonly routerLink: string;
  readonly isDefault: boolean;

  constructor(predecessor?: NavbarTabData, data?: NavbarTabDataType) {
    Object.assign(this, predecessor || {}, data || {});
  }

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

  static build = buildMethodFactory(wrapMenuNavData, MenuNavData);

  copy(director: MenuNavDataDirector) {
    let wrapper: MenuNavDataWrapper = wrapMenuNavData.value(this);
    director(wrapper);
    return wrapper.unwrap();
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
    openSidenav(): NavbarDataWrapper;
    closeSidenav(): NavbarDataWrapper;
    toggleSidenav(): NavbarDataWrapper;
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
  openSidenav(): NavbarDataModelBuilder;
  closeSidenav(): NavbarDataModelBuilder;
  toggleSidenav(): NavbarDataModelBuilder;
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

