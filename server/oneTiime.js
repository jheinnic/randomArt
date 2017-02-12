/**
 * Created by jheinnic on 2/9/17.
 */
var app = require("./server1");
var async = require("async");
var Observable = require("rxjs");
Observable = Observable.Observable;

app.start();

var User = app.models.User;
var Role = app.models.Role;
var RoleMapping = app.models.RoleMapping;

// var jchUserId = "google.111442084842438284903";
var jchUserId = "ObjectId(\" 587a6f43e329b6557e5e9bd1\")";


var admin, moderator, contributor;

// async.forEach([
//   { name: "Admin", description: "Administrative Role" },
//   { name: "Moderator", description: "Priviledged Moderator Role" },
//   { name: "Contributor", description: "Unprivileged Contributor Role"}
// ], function(data, cb) {
//   Role.create(data, {}, cb);
// }, function(err, result) {
//   console.error(err);
//   console.log(result);
//   admin = result[0];
//   moderator = result[1];
//   contributor = result[2];
//
//   console.log(admin);
//   console.log(moderator);
//   console.log(contributor);
//
//   RoleMapping.create({
//     principalType: "USER",
//     principalId: jchUserId,
//     roleId: admin.id
//   }, {}, function(err, data) {
//     console.log(data);
//     console.error(err);
//   });
//   RoleMapping.create({
//     principalType: "ROLE",
//     principalId: admin.id,
//     roleId: moderator.id
//   }, {}, function(err, data) {
//     console.log(data);
//     console.error(err);
//   });

  var ImageChain = app.models.ImageChain;

  var axis240x240 = computeAffinePixelPoints(240, -1, 1);
  var axis360x360 = computeAffinePixelPoints(360, -1, 1);
  var axis480x480 = computeAffinePixelPoints(480, -1, 1);
  var axis640x640 = computeAffinePixelPoints(640, -1, 1);

  var axis360x240 = computeAffinePixelPoints(360, -360 / 240, 360 / 240);
  var axis240x360 = computeAffinePixelPoints(360, -240 / 360, 240 / 360);
  var axis480x360 = computeAffinePixelPoints(480, -480 / 360, 480 / 360);
  var axis360x480 = computeAffinePixelPoints(480, -360 / 480, 360 / 480);
  var axis640x480 = computeAffinePixelPoints(640, -640 / 480, 640 / 480);
  var axis480x640 = computeAffinePixelPoints(640, -480 / 640, 480 / 640);

  async.forEach([
      {
        displayName: "240x240, square",
        pixelWidth: 240,
        pixelHeight: 240,
        pixelCount: 240 * 240,
        fitOrFill: "square",
        widthPoints: axis240x240,
        heightPoints:axis240x240
      },
      {
        displayName: "360x240, fit",
        pixelWidth: 360,
        pixelHeight: 240,
        pixelCount: 360 * 240,
        fitOrFill: "fit",
        widthPoints: axis360x360,
        heightPoints:axis240x360
      },
      {
        displayName: "360x360, square",
        pixelWidth: 360,
        pixelHeight: 360,
        pixelCount: 360 * 360,
        fitOrFill: "square",
        widthPoints: axis360x360,
        heightPoints:axis360x360
      },
      {
        displayName: "480x360, fill",
        pixelWidth: 480,
        pixelHeight: 360,
        pixelCount: 480 * 360,
        fitOrFill: "fill",
        widthPoints: axis480x360,
        heightPoints:axis360x360
      },
      {
        displayName: "480x480, square",
        pixelWidth: 480,
        pixelHeight: 480,
        pixelCount: 480 * 480,
        fitOrFill: "square",
        widthPoints: axis480x480,
        heightPoints:axis480x480
      },
      {
        displayName: "640x480, fit",
        pixelWidth: 640,
        pixelHeight: 480,
        pixelCount: 640 * 480,
        fitOrFill: "fit",
        widthPoints: axis640x640,
        heightPoints:axis480x640
      },
      {
        displayName: "640x480, fill",
        pixelWidth: 640,
        pixelHeight: 480,
        pixelCount: 640 * 480,
        fitOrFill: "fill",
        widthPoints: axis640x480,
        heightPoints:axis480x480
      }],
    function(data, cb) {
      ImageChain.create(data, {}, function(err, data2) {
        console.error(err);
        console.log(data2);

        cb(null, data2);
      });
    },
    function(err, results) {
      console.error(err);
      console.log(results);
    });
// });


function computeAffinePixelPoints(pointCount, minValue, maxValue) {
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
  return widthPoints.map(
    function (xVal, xIdx) {
      return heightPoints.map(
        function (yVal, yIdx) {
          return [[xIdx, yIdx], [xVal, yVal]];
        }
      );
    }
  ).reduce(
    function(sum, next) {
      return sum.concat(next);
    }, []
  );
}
