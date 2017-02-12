///<reference path='../../../node_modules/immutable/dist/immutable.d.ts'/>
import builder = require('fluent-interface-builder');
import {
  unwrapHelper, buildMethodFactory, copyMethodFactory, FactoryWrapper, Partial, BuildMethod,
  CopyMethod, copyMethod
} from "../../../common/lib/datamodel-ts";
import Immutable = require('immutable');
import _ = require('lodash');

//
// Generic Helper Methods
//


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
      let oldDefault = tabs.findEntry(
        function (val:NavbarTabData) { return val.isDefault;});
      if (! _.isUndefined(oldDefault)) {
        tabs = tabs.set(
          oldDefault[0],
          new NavbarTabData(oldDefault[1], {isDefault: false}));
      }
    }

    let entry = tabs.findEntry(
      function (val:NavbarTabData) { return val.displayName === displayName; });
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
    return new NavbarData(context, {tabs: Immutable.List<NavbarTabData>()});
  })
  .chain('addMenuNav', (
    displayName: string, director: MenuNavDataDirector
  ) => (context: NavbarData) => {
    var newItem = new MenuNavData(undefined, {displayName: displayName});

    // TODO: Make sure displayName is unique.

    return new NavbarData(context, {
      menuItems: context.menuItems.push(
        newItem.copy(director)
      )
    });
  })
  .chain('editMenuNav', (
    displayName: string, director: MenuNavDataDirector
  ) => (context: NavbarData) => {
    let entry = context.menuItems.findEntry((item:MenuNavData) => {
      return item.displayName === displayName
    });

    if (!entry) { throw new Error("No such menu item: " + displayName); }

    return new NavbarData(context, {
      menuItems: context.menuItems.set(
        entry[0], entry[1].copy(director))
    });
  })
  .chain('deleteMenuNav', (displayName: string) => (context: NavbarData) => {
    return new NavbarData(context, {
      menuItems: context.menuItems.filter( function(nextItem:MenuNavData) {
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
    return new NavbarData(context, {
      tabs: context.tabs.push(NavbarTabData.build(director))
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

export type NavbarDataType = Partial<NavbarData>;

export class NavbarData
{
  readonly brandName: string;
  readonly sidenavOpen: boolean;
  readonly tabs: Immutable.List<NavbarTabData> = Immutable.List<NavbarTabData>();
  readonly menuItems: Immutable.List<MenuNavData> = Immutable.List<MenuNavData>();

  constructor(predecessor?: NavbarData, data?: Partial<NavbarData>) {
    Object.assign(this, predecessor || {}, data || {});
  }

  static build = buildMethodFactory(wrapNavbarData, NavbarData);

  // static build(director: NavbarDataDirector) {
  //   let wrapper: NavbarDataWrapper = wrapNavbarData.value(new NavbarData());
  //   director(wrapper);
  //   return wrapper.unwrap();
  // }

  acopy: CopyMethod<NavbarData, NavbarDataModelBuilder> = copyMethodFactory(wrapNavbarData);

  bcopy(director: NavbarDataDirector): NavbarData {
    return copyMethod(this, wrapNavbarData, director);
  }

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

  constructor(predecessor?: NavbarTabData, data?: Partial<NavbarTabData>) {
    Object.assign(this, predecessor || {}, data || {});
  }

  static build = buildMethodFactory(wrapNavbarTabData, NavbarTabData);

  copy(director: NavbarTabDataDirector) {
    let wrapper: NavbarTabDataWrapper = wrapNavbarTabData.value(this);
    director(wrapper);
    return wrapper.unwrap();
  }
}

export class MenuNavData
{
  readonly displayName: string;
  readonly routerLink: string;
  readonly disabled: boolean;
  readonly orderRank: number;
  readonly iconName: string;

  constructor(predecessor?: MenuNavData, data?: Partial<MenuNavData>) {
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

type NavbarDataWrapper = FactoryWrapper<NavbarData, NavbarDataModelBuilder>;

type MenuNavDataWrapper = FactoryWrapper<MenuNavData, MenuNavDataModelBuilder>;

type NavbarTabDataWrapper = FactoryWrapper<NavbarTabData, NavbarTabDataModelBuilder>;

type NavbarDataTwoWrapper = FactoryWrapper<NavbarData, NavbarDataModelBuilderTwo>;


//
// Builder Interfaces
//

export interface NavbarDataModelBuilder
{
  brandName(brandName: string): this;
  openSidenav(): this;
  closeSidenav(): this;
  toggleSidenav(): this;
  addTab(displayName: string, routerLink: string, isDefault: boolean): this;
  resetTabs(): this;
  addMenuNav(displayName: string, director: MenuNavDataDirector): this;
  editMenuNav(displayName: string, director: MenuNavDataDirector): this;
  removeMenuNav(displayName: string): this;
}

export interface MenuNavDataModelBuilder
{
  routerLink(routerLink: string): this;
  disabled(disabled: boolean): this;
  orderRank(orderRank: number): this;
  iconName(iconName: string): this;
}
;

interface NavbarTabDataModelBuilder
{
  displayName(displayName: string): this;
  outerLink(routerLink: string): this;
}

interface NavbarDataModelBuilderTwo
{
  brandName(brandName: string): this;
  addTab(director: NavbarTabDataDirector): this;
}

