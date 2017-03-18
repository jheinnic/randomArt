"use strict";
var index_1 = require("../../../common/lib/datamodel-ts/index");
// const initialPaintProgressWrapper =
//   deriveFactoryWrapper<InitialPaintProgress>(['width', 'height']);
//
// export class InitialPaintProgress {
//   public readonly kind = 'initial';
//   public readonly width: number;
//   public readonly height: number;
//
//   copy = copyMethodFactory(initialPaintProgressWrapper);
//
//   static build =
//     buildMethodFactory(initialPaintProgressWrapper, InitialPaintProgress);
//
//   constructor() { }
// }
/**
 * Encapsulation for a partial set of paintable pixels, giving
 */
var wordPaintProgressWrapper = index_1.deriveFactoryWrapper(['paintPoints', 'pctDone']);
var WordPaintProgress = (function () {
    function WordPaintProgress() {
        this.copy = index_1.copyMethodFactory(wordPaintProgressWrapper);
    }
    return WordPaintProgress;
}());
WordPaintProgress.build = index_1.buildMethodFactory(wordPaintProgressWrapper, WordPaintProgress);
exports.WordPaintProgress = WordPaintProgress;
// export type PaintProgress = InitialPaintProgress | IncrementalPaintProgress;
//
// type PaintProgressKindStrings = 'initial' | 'incremental';
//
// export const PaintProgressKind: KeyToValue<PaintProgressKindStrings> = {
//   initial: "initial",
//   incremental: "incremental"
// };
// const paintProgressWrapper = deriveFactoryWrapper<PaintProgress>(
//   new PaintProgress());
// let test = PaintProgress.build((builder) => {builder.paintPoints([]).pctDone(40)});
// let test2 = test.copy((builder) => {builder.paintPoints([]).pctDone(40)});
// console.log(test);
// console.log(test2);
