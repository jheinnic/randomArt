"use strict";
/**
 * Created by jheinnic on 2/12/17.
 */
var index_1 = require("../../../common/lib/datamodel-ts/index");
/**
 * Encapsulation for a partial set of paintable pixels, giving
 */
var wordPaintResultWrapper = index_1.deriveFactoryWrapper(['imageData']);
var WordPaintResult = (function () {
    function WordPaintResult() {
    }
    return WordPaintResult;
}());
WordPaintResult.build = index_1.buildMethodFactory(wordPaintResultWrapper, WordPaintResult);
exports.WordPaintResult = WordPaintResult;
