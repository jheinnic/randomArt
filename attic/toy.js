"use strict";
/**
 * Created by jheinnic on 1/17/17.
 */
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/interval");
require("rxjs/add/observable/of");
require("rxjs/add/observable/empty");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/concatMap");
var interval = Observable_1.Observable.interval(1000);
var result = interval.concatMap(function (x) {
    return x % 2 === 1 ? Observable_1.Observable.of('a', 'b', 'c') : Observable_1.Observable.empty();
});
result.subscribe(function (x) { return console.log(x); });
