/**
 * Created by jheinnic on 2/4/17.
 */
"use strict";
var point_datamodel_1 = require("../shared/canvas-util/point.datamodel");
var Observable_1 = require("rxjs/Observable");
var builder = require("fluent-interface-builder");
// Project [0...(pointCount)] onto [minValue...maxValue] by affine
// matrix transformation in such a way that the set is symetrically
// balanced (e.g. same distance between any consecutive points and
// the distance between either max or min and the center point are
// identitcal.
//
// To do this, consider the symetrial set of pointCount+1 items,
// and enumerate the values at the midpoint between any two points.
function computeAffinePixelPoints(pointCount, minValue, maxValue) {
    // console.log(`Calculating map from [0...${pointCount}-1] onto [${minValue}...${maxValue}]`)
    var initial = 0.5;
    var translate = minValue;
    var scale = (maxValue - minValue) / pointCount;
    var pointsArray = [];
    for (var ii = initial; ii < pointCount; ii += 1) {
        pointsArray.push((ii * scale) + translate);
    }
    return pointsArray;
}
function derivePointMaps(widthPoints, heightPoints) {
    return Observable_1.Observable.from(widthPoints)
        .flatMap(function (xVal, xIdx) {
        return Observable_1.Observable.from(heightPoints)
            .map(function (yVal, yIdx) {
            return [
                new point_datamodel_1.Point(undefined, {
                    x: xIdx,
                    y: yIdx
                }),
                new point_datamodel_1.Point(undefined, {
                    x: xVal,
                    y: yVal
                })
            ];
        });
    })
        .map(function (pair, index) {
        return new point_datamodel_1.PointMap(pair[0].withId(index), pair[1]);
    });
}
var wrapImageChainDef = builder.build()
    .chain('dimensions', function (pixelWidth, pixelHeight, fitOrFill) {
    return function (context) {
        return Object.assign(context, {
            pixelWidth: pixelWidth,
            pixelHeight: pixelHeight,
            fitOrFill: fitOrFill
        });
    };
})
    .chain('displayName', function (displayName) { return function (context) {
    return Object.assign(context, { displayName: displayName });
}; })
    .chain('localId', function (localId) { return function (context) {
    return Object.assign(context, { localId: localId });
}; })
    .chain('uuid', function (uuid) { return function (context) {
    return Object.assign(context, { uuid: uuid });
}; })
    .unwrap('unwrap', function () { return function (context) {
    return new ImageChainDef(context);
}; });
var ImageChainDef = (function () {
    function ImageChainDef(params) {
        Object.assign(this, params);
        var now = new Date().getTime();
        var xScale = 1.0;
        var yScale = 1.0;
        if (this.pixelWidth === this.pixelHeight) {
            if (this.fitOrFill !== 'square') {
                throw new Error("fitOrFill must be square if width === height");
            }
        }
        else if (this.fitOrFill === 'square') {
            throw new Error("fitOrFill cannot be square unless width === height");
        }
        else if (this.pixelWidth > this.pixelHeight) {
            if (this.fitOrFill === 'fill') {
                xScale = this.pixelWidth / this.pixelHeight;
            }
            else {
                yScale = this.pixelHeight / this.pixelWidth;
            }
        }
        else if (this.fitOrFill === 'fill') {
            yScale = this.pixelHeight / this.pixelWidth;
        }
        else {
            xScale = this.pixelWidth / this.pixelHeight;
        }
        this.widthPoints = computeAffinePixelPoints(this.pixelWidth, -1 * xScale, xScale);
        this.heightPoints = computeAffinePixelPoints(this.pixelHeight, -1 * yScale, yScale);
        this.pointMaps = derivePointMaps(this.widthPoints, this.heightPoints);
        this.pixelCount = this.pixelWidth * this.pixelHeight;
        this.createdAt = now;
        this.modifiedAt = now;
    }
    ImageChainDef.build = function (director) {
        var wrapper = wrapImageChainDef.value({});
        director(wrapper);
        return wrapper.unwrap();
    };
    return ImageChainDef;
}());
exports.ImageChainDef = ImageChainDef;
