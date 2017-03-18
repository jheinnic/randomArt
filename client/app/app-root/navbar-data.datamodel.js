"use strict";
///<reference path='../../../node_modules/immutable/dist/immutable.d.ts'/>
var builder = require("fluent-interface-builder");
var datamodel_ts_1 = require("../../../common/lib/datamodel-ts");
var Immutable = require("immutable");
var _ = require("lodash");
//
// Generic Helper Methods
//
//
// Wrapper Implementations
//
var wrapNavbarData = builder.build()
    .chain('brandName', function (brandName) { return function (context) {
    return new NavbarData(context, { brandName: brandName });
}; })
    .chain('openSidenav', function () { return function (context) {
    return new NavbarData(context, { sidenavOpen: true });
}; })
    .chain('closeSidenav', function () { return function (context) {
    return new NavbarData(context, { sidenavOpen: false });
}; })
    .chain('toggleSidenav', function () { return function (context) {
    return new NavbarData(context, { sidenavOpen: !context.sidenavOpen });
}; })
    .chain('addTab', function (displayName, routerLink, isDefault) {
    if (isDefault === void 0) { isDefault = false; }
    return function (context) {
        var tabs = context.tabs;
        if (isDefault) {
            var oldDefault = tabs.findEntry(function (val) { return val.isDefault; });
            if (!_.isUndefined(oldDefault)) {
                tabs = tabs.set(oldDefault[0], new NavbarTabData(oldDefault[1], { isDefault: false }));
            }
        }
        var entry = tabs.findEntry(function (val) { return val.displayName === displayName; });
        if (!_.isUndefined(entry)) {
            tabs = tabs.set(entry[0], new NavbarTabData(entry[1], {
                displayName: displayName,
                routerLink: routerLink,
                isDefault: isDefault
            }));
        }
        else {
            tabs = tabs.push(new NavbarTabData(undefined, {
                displayName: displayName,
                routerLink: routerLink,
                isDefault: isDefault
            }));
        }
        return new NavbarData(context, { tabs: tabs });
    };
})
    .chain('resetTabs', function () { return function (context) {
    return new NavbarData(context, { tabs: Immutable.List() });
}; })
    .chain('addMenuNav', function (displayName, director) { return function (context) {
    var newItem = new MenuNavData(undefined, { displayName: displayName });
    // TODO: Make sure displayName is unique.
    return new NavbarData(context, {
        menuItems: context.menuItems.push(newItem.copy(director))
    });
}; })
    .chain('editMenuNav', function (displayName, director) { return function (context) {
    var entry = context.menuItems.findEntry(function (item) {
        return item.displayName === displayName;
    });
    if (!entry) {
        throw new Error("No such menu item: " + displayName);
    }
    return new NavbarData(context, {
        menuItems: context.menuItems.set(entry[0], entry[1].copy(director))
    });
}; })
    .chain('deleteMenuNav', function (displayName) { return function (context) {
    return new NavbarData(context, {
        menuItems: context.menuItems.filter(function (nextItem) {
            return nextItem.displayName != displayName;
        }).toList()
    });
}; }).unwrap('unwrap', datamodel_ts_1.unwrapHelper);
var wrapNavbarTabData = builder.build()
    .chain('displayName', function (displayName) { return function (context) {
    return new NavbarTabData(context, { displayName: displayName });
}; })
    .chain('routerLink', function (routerLink) { return function (context) {
    return new NavbarTabData(context, { routerLink: routerLink });
}; })
    .unwrap('unwrap', datamodel_ts_1.unwrapHelper);
var wrapNavbarDataTwo = builder.build()
    .chain('brandName', function (brandName) { return function (context) {
    return new NavbarData(context, { brandName: brandName });
}; })
    .chain('addTab', function (director) { return function (context) {
    return new NavbarData(context, {
        tabs: context.tabs.push(NavbarTabData.build(director))
    });
}; })
    .unwrap('unwrap', datamodel_ts_1.unwrapHelper);
var wrapMenuNavData = builder.build()
    .chain('routerLink', function (routerLink) { return function (context) {
    return new MenuNavData(context, { routerLink: routerLink });
}; })
    .chain('disabled', function (disabled) { return function (context) {
    return new MenuNavData(context, { disabled: disabled });
}; })
    .chain('orderRank', function (orderRank) { return function (context) {
    return new MenuNavData(context, { orderRank: orderRank });
}; })
    .chain('iconName', function (iconName) { return function (context) {
    return new MenuNavData(context, { iconName: iconName });
}; })
    .unwrap('unwrap', datamodel_ts_1.unwrapHelper);
var NavbarData = (function () {
    function NavbarData(predecessor, data) {
        this.tabs = Immutable.List();
        this.menuItems = Immutable.List();
        // static build(director: NavbarDataDirector) {
        //   let wrapper: NavbarDataWrapper = wrapNavbarData.value(new NavbarData());
        //   director(wrapper);
        //   return wrapper.unwrap();
        // }
        this.acopy = datamodel_ts_1.copyMethodFactory(wrapNavbarData);
        Object.assign(this, predecessor || {}, data || {});
    }
    NavbarData.prototype.bcopy = function (director) {
        return datamodel_ts_1.copyMethod(this, wrapNavbarData, director);
    };
    NavbarData.prototype.copy = function (director) {
        var wrapper = wrapNavbarData.value(this);
        director(wrapper);
        return wrapper.unwrap();
    };
    return NavbarData;
}());
NavbarData.build = datamodel_ts_1.buildMethodFactory(wrapNavbarData, NavbarData);
exports.NavbarData = NavbarData;
var NavbarTabData = (function () {
    function NavbarTabData(predecessor, data) {
        Object.assign(this, predecessor || {}, data || {});
    }
    NavbarTabData.prototype.copy = function (director) {
        var wrapper = wrapNavbarTabData.value(this);
        director(wrapper);
        return wrapper.unwrap();
    };
    return NavbarTabData;
}());
NavbarTabData.build = datamodel_ts_1.buildMethodFactory(wrapNavbarTabData, NavbarTabData);
exports.NavbarTabData = NavbarTabData;
var MenuNavData = (function () {
    function MenuNavData(predecessor, data) {
        Object.assign(this, predecessor || {}, data || {});
    }
    MenuNavData.prototype.copy = function (director) {
        var wrapper = wrapMenuNavData.value(this);
        director(wrapper);
        return wrapper.unwrap();
    };
    return MenuNavData;
}());
MenuNavData.build = datamodel_ts_1.buildMethodFactory(wrapMenuNavData, MenuNavData);
exports.MenuNavData = MenuNavData;
;
