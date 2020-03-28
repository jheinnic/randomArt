/**
 * Created by jheinnic on 1/23/17.
 */
"use strict";

var _ = require('lodash');

function isGreaterThan(a, b) {
  return a > b;
}

function isLessThan(a, b) {
  return a < b;
}

function isTokenArrayPreoder(tokens) {
  var rootIdx = 0;
  var terminal = tokens.length;

  var rootValue = tokens[rootIdx];
  var leftIdx = tokens.slice((rootIdx + 1), terminal).findIndex(_.partial(isLessThan, rootValue));
  var rightIdx = tokens.slice((leftIdx > 0) ? (leftIdx + 1) : (rootIdx + 1), terminal).findIndex(_.partial(isGreaterThan, rootValue));
}
