"use strict";
/**
 * Created by jheinnic on 2/12/17.
 */
var index_1 = require("../../../common/lib/datamodel-ts/index");
/**
 * Encapsulation for a partial set of paintable pixels, giving
 */
var wordPaintInputWrapper = index_1.deriveFactoryWrapper(['phrase', 'chain']);
var WordPaintInput = (function () {
    function WordPaintInput() {
        this.copy = index_1.copyMethodFactory(wordPaintInputWrapper);
    }
    return WordPaintInput;
}());
WordPaintInput.build = index_1.buildMethodFactory(wordPaintInputWrapper, WordPaintInput);
exports.WordPaintInput = WordPaintInput;
