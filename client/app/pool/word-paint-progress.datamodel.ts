/**
 * Created by jheinnic on 2/12/17.
 */
import {PaintablePoint} from "../shared/canvas-util/point.datamodel";
import {
  deriveFactoryWrapper, copyMethodFactory, buildMethodFactory, FluentWrapperBuilder,
  reflectiveBuildMethodFactory, reflectiveCopyMethodFactory
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
const WordPaintProgressWrapper =
  deriveFactoryWrapper<WordPaintProgress>(['paintPoints', 'pctDone']);

export class WordPaintProgress
{
  // public readonly kind = 'word';
  public readonly paintPoints: PaintablePoint[];
  public readonly pctDone: number;

  copy = reflectiveCopyMethodFactory(WordPaintProgressWrapper);

  static build =
    reflectiveBuildMethodFactory(WordPaintProgressWrapper, WordPaintProgress);

  constructor(source: Partial<WordPaintProgress>) { Object.assign(self, source); }
}

