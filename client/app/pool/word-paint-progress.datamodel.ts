/**
 * Created by jheinnic on 2/12/17.
 */
import {PaintablePoint} from "../shared/canvas-util/point.datamodel";
import {
  deriveFactoryWrapper, copyMethodFactory, buildMethodFactory, ReflectiveBuilder
} from "../../../common/lib/datamodel-ts/index";

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
const wordPaintProgressWrapper: ReflectiveBuilder<WordPaintProgress> =
  deriveFactoryWrapper<WordPaintProgress>(['paintPoints', 'pctDone']);

export class WordPaintProgress
{
  // public readonly kind = 'word';
  public readonly paintPoints: PaintablePoint[];
  public readonly pctDone: number;

  copy = copyMethodFactory(wordPaintProgressWrapper);

  static build =
    buildMethodFactory(wordPaintProgressWrapper, WordPaintProgress);

  constructor() { }
}

