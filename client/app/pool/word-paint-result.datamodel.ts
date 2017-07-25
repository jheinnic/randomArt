/**
 * Created by jheinnic on 2/12/17.
 */
import {
  deriveFactoryWrapper, reflectiveCopyMethodFactory, reflectiveBuildMethodFactory
} from "../../../common/lib/datamodel-ts/index";


/**
 * Encapsulation for a partial set of paintable pixels, giving
 */
const WordPaintResultWrapper = deriveFactoryWrapper<WordPaintResult>(['imageData']);

export class WordPaintResult
{
  public readonly imageData: Blob;

  static build =
    reflectiveBuildMethodFactory(WordPaintResultWrapper, WordPaintResult);

  copy = reflectiveCopyMethodFactory(WordPaintResultWrapper);

  constructor(src: Partial<WordPaintResult>) { Object.assign(self, src)}
}
