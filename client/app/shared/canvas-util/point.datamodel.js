"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Point = (function () {
    function Point(point, override) {
        this.x = 0;
        this.y = 0;
        Object.assign(this, point, override);
    }
    Point.prototype.getLabel = function () { return 'Point'; };
    Point.prototype.withId = function (id) {
        return new IndexedPoint(this, { id: id });
    };
    Point.prototype.withFillStyle = function (fillStyle) {
        return new PaintablePoint(this, { fillStyle: fillStyle });
    };
    Point.asString = function (point) {
        var retVal;
        if (typeof point === 'object') {
            retVal = "<" + point.x + ", " + point.y + ">";
        }
        else if (typeof point === 'number') {
            retVal = "number(" + point + ")";
        }
        else {
            retVal = "**unknown point(" + point + ")**";
        }
        return retVal;
    };
    return Point;
}());
exports.Point = Point;
var IndexedPoint = (function (_super) {
    __extends(IndexedPoint, _super);
    function IndexedPoint(base, override) {
        var _this = _super.call(this, base, override) || this;
        _this.id = 0;
        Object.assign(_this, base, override);
        return _this;
    }
    IndexedPoint.prototype.getLabel = function () { return 'IndexedPoint -> ' + _super.prototype.getLabel.call(this); };
    return IndexedPoint;
}(Point));
exports.IndexedPoint = IndexedPoint;
var PaintablePoint = (function (_super) {
    __extends(PaintablePoint, _super);
    function PaintablePoint(base, override) {
        var _this = _super.call(this, base, override) || this;
        _this.fillStyle = 'rgb(0,0,0)';
        Object.assign(_this, base, override);
        return _this;
    }
    PaintablePoint.prototype.getLabel = function () { return 'PaintablePoint ->' + _super.prototype.getLabel.call(this); };
    PaintablePoint.prototype.withId = function (id) {
        return new PaintablePoint(this, { id: id });
    };
    PaintablePoint.prototype.paintTo = function (context) {
        context.fillStyle = this.fillStyle;
        context.fillRect(this.x, this.y, 1, 1);
    };
    PaintablePoint.asString = function (paintPoint) {
        var retVal;
        if (typeof paintPoint === 'object') {
            retVal = "(" + paintPoint.fillStyle + ") at <" + paintPoint.x + "," + paintPoint.y + ">";
        }
        else {
            retVal = "**unknown paint point(" + paintPoint + ")**";
        }
        return retVal;
    };
    return PaintablePoint;
}(IndexedPoint));
exports.PaintablePoint = PaintablePoint;
var PointMap = (function () {
    function PointMap(from, to) {
        this.from = from;
        this.to = to;
    }
    Object.defineProperty(PointMap.prototype, "id", {
        get: function () {
            return this.from.id;
        },
        enumerable: true,
        configurable: true
    });
    PointMap.asString = function (pointMap) {
        var retVal;
        if (typeof pointMap === 'object') {
            retVal = Point.asString(pointMap.from) + " -> " + Point.asString(pointMap.to);
        }
        else if (typeof pointMap === 'number') {
            retVal = "number(" + pointMap + ")";
        }
        else {
            retVal = "**unknown map(" + pointMap + ")**";
        }
        return retVal;
    };
    return PointMap;
}());
exports.PointMap = PointMap;
