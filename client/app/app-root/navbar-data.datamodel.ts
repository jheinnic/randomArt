///<reference path='../../../node_modules/immutable/dist/immutable.d.ts'/>
import builder = require('fluent-interface-builder');
import {
  unwrapHelper, buildMethodFactory, copyMethodFactory, Partial, BuildMethod, CopyMethod,
  copyMethod, InstanceWrapper
} from "../../../common/lib/datamodel-ts";
import Immutable = require('immutable');
import _ = require('lodash');
import {Builder, Ctor, IBuilder} from "fluent-interface-builder";

//
// Generic Helper Methods
//


//
// Wrapper Implementations
//

const NavbarDataWrapper: Ctor<NavbarData,INavbarDataWrapper> = new Builder<NavbarData,INavbarDataWrapper>()
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
    let tabs: Immutable.List<NavbarTabData> = context.tabs;
    if (isDefault) {
      let oldDefault = tabs.findEntry(function (val: NavbarTabData) { return val.isDefault;});
      if (!_.isUndefined(oldDefault)) {
        tabs = tabs.set(oldDefault[0], new NavbarTabData(oldDefault[1], {isDefault: false}));
      }
    }

    let entry = tabs.findEntry(function (val: NavbarTabData) {
      return val.displayName === displayName;
    });
    if (!_.isUndefined(entry)) {
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
    let newItem = new MenuNavData(undefined, {displayName: displayName});

    // TODO: Make sure displayName is unique.

    return new NavbarData(context, {
      menuItems: context.menuItems.push(newItem.copy(director))
    });
  })
  .chain('editMenuNav', (
    displayName: string, director: MenuNavDataDirector
  ) => (context: NavbarData) => {
    let entry = context.menuItems.findEntry((item: MenuNavData) => {
      return item.displayName === displayName
    });

    if (!entry) {
      throw new Error("No such menu item: " + displayName);
    }

    return new NavbarData(context, {
      menuItems: context.menuItems.set(entry[0], entry[1].copy(director))
    });
  })
  .chain('deleteMenuNav', (displayName: string) => (context: NavbarData) => {
    return new NavbarData(context, {
      menuItems: context.menuItems.filter(function (nextItem: MenuNavData) {
        return nextItem.displayName != displayName;
      }).toList()
    });
  })
  .unwrap('unwrap', unwrapHelper)
  .value;


const NavbarTabDataWrapper = new Builder<NavbarTabData,INavbarTabDataWrapper>()
  .chain('displayName', (displayName: string) => (context: NavbarTabData) => {
    return new NavbarTabData(context, {displayName: displayName});
  })
  .chain('routerLink', (routerLink: string) => (context: NavbarTabData) => {
    return new NavbarTabData(context, {routerLink: routerLink});
  })
  .unwrap('unwrap', unwrapHelper)
  .value;


const WrapNavbarDataTwo = new Builder<NavbarData,INavbarDataTwoWrapper>()
  .chain('brandName', (brandName: string) => (context: NavbarData) => {
    return new NavbarData(context, {brandName: brandName}) as NavbarData;
  })
  .chain('addTab', (director: NavbarTabDataDirector) => (context: NavbarData) => {
    return new NavbarData(context, {
      tabs: context.tabs.push(NavbarTabData.build(director))
    });
  })
  .unwrap('unwrap', unwrapHelper)
  .value;


let MenuNavDataWrapper = new Builder<MenuNavData, IMenuNavDataWrapper>()
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
  .unwrap('unwrap', unwrapHelper)
  .value;


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

  static build = buildMethodFactory(NavbarDataWrapper, NavbarData);

  // static build(director: NavbarDataDirector) {
  //   let wrapper: NavbarDataWrapper = wrapNavbarData.value(new NavbarData());
  //   director(wrapper);
  //   return wrapper.unwrap();
  // }

  acopy: CopyMethod<NavbarData, INavbarDataWrapper> = copyMethodFactory(NavbarDataWrapper);

  // bcopy(director: NavbarDataDirector): NavbarData {
  //   return copyMethod(this, wrapNavbarData, director);
  // }

  copy(director: NavbarDataDirector) {
    let wrapper: INavbarDataWrapper = new NavbarDataWrapper(this);
    director(wrapper);
    return wrapper.value;
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

  static build = buildMethodFactory(NavbarTabDataWrapper, NavbarTabData);

  copy(director: NavbarTabDataDirector) {
    let wrapper: INavbarTabDataWrapper = new NavbarTabDataWrapper(this);
    director(wrapper);
    return wrapper.value;
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

  static build = buildMethodFactory(MenuNavDataWrapper, MenuNavData);

  copy(director: MenuNavDataDirector) {
    let wrapper: IMenuNavDataWrapper = new MenuNavDataWrapper(this);
    director(wrapper);
    return wrapper.value;
  }
}

//
// Director types
//

export type NavbarDataDirector = (builder: INavbarDataModelBuilder) => void;

export type MenuNavDataDirector = (builder: IMenuNavDataModelBuilder) => void;

type NavbarTabDataDirector = (builder: INavbarTabDataModelBuilder) => void;


//
// Wrapper types
//

type INavbarDataWrapper = InstanceWrapper<NavbarData, INavbarDataModelBuilder>;

type IMenuNavDataWrapper = InstanceWrapper<MenuNavData, IMenuNavDataModelBuilder>;

type INavbarTabDataWrapper = InstanceWrapper<NavbarTabData, INavbarTabDataModelBuilder>;

type INavbarDataTwoWrapper = InstanceWrapper<NavbarData, INavbarDataModelBuilderTwo>;


//
// Builder Interfaces
//

export interface INavbarDataModelBuilder
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

export interface IMenuNavDataModelBuilder
{
  routerLink(routerLink: string): this;
  disabled(disabled: boolean): this;
  orderRank(orderRank: number): this;
  iconName(iconName: string): this;
}


interface INavbarTabDataModelBuilder
{
  displayName(displayName: string): this;
  outerLink(routerLink: string): this;
}

interface INavbarDataModelBuilderTwo
{
  brandName(brandName: string): this;
  addTab(director: NavbarTabDataDirector): this;
}

