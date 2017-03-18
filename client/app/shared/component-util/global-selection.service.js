"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by jheinnic on 2/5/17.
 */
var abstract_selection_service_1 = require("./abstract-selection.service");
var GlobalSelection = (function (_super) {
    __extends(GlobalSelection, _super);
    function GlobalSelection() {
        return _super.call(this) || this;
    }
    return GlobalSelection;
}(abstract_selection_service_1.AbstractSelection));
exports.GlobalSelection = GlobalSelection;
