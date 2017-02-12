/**
 * Created by jheinnic on 2/4/17.
 */
(function() {
  "use strict";

  module.exports = function (ImageChain) {
    var loopback = require("loopback");

    ImageChain.afterRemote(
      "create",
      function (context, imageChain, next) {
        var xScale = 1.0;
        var yScale = 1.0;

        if (imageChain.pixelWidth === imageChain.pixelHeight) {
          if (imageChain.fitOrFill !== "square") {
            throw new Error("fitOrFill must be square if width === height");
          }
        } else if (imageChain.fitOrFill === "square") {
          throw new Error("fitOrFill cannot be square unless width === height");
        } else if (imageChain.pixelWidth > imageChain.pixelHeight) {
          if (imageChain.fitOrFill === "fill") {
            xScale = imageChain.pixelWidth / imageChain.pixelHeight;
          } else {
            yScale = imageChain.pixelHeight / imageChain.pixelWidth;
          }
        } else if (imageChain.fitOrFill === "fill") {
          yScale = imageChain.pixelHeight / imageChain.pixelWidth;
        } else {
          xScale = imageChain.pixelWidth / imageChain.pixelHeight;
        }

        this.widthPoints =
          computeAffinePixelPoints(imageChain.pixelWidth, -1 * xScale, xScale);
        this.heightPoints =
          computeAffinePixelPoints(imageChain.pixelHeight, -1 * yScale, yScale);
        this.pointMaps =
          mergePointArrays(this.widthPoints, this.heightPoints);

        next(undefined, imageChain);
      }
    );

    // Project [0...(pointCount)] onto [minValue...maxValue] by affine
    // matrix transformation in such a way that the set is symetrically
    // balanced (e.g. same distance between any consecutive points and
    // the distance between either max or min and the center point are
    // identitcal.
    //
    // To do this, consider the symetrial set of pointCount+1 items,
    // and enumerate the values at the midpoint between any two points.
    function computeAffinePixelPoints(pointCount, minValue, maxValue) {
      var initial = 0.5;
      var translate = minValue;
      var scale = (maxValue - minValue) / pointCount;
      var pointsArray = [];

      var ii;
      for (ii = initial; ii < pointCount; ii += 1) {
        pointsArray.push((ii * scale) + translate);
      }
      return pointsArray;
    }

    function mergePointArrays(widthPoints, heightPoints) {
      return widthPoints.map(
        function(xVal, xIdx) {
          return heightPoints.map(
            function(yVal, yIdx) {
              return [[xIdx, yIdx], [xVal,yVal]];
            }
          );
        }
      );
    }
  };
})();
