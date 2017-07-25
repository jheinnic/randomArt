/**
 * Created by jheinnic on 2/12/17.
 */
import {
  deriveFactoryWrapper, FluentWrapperBuilder, reflectiveBuildMethodFactory,
  reflectiveCopyMethodFactory
} from "../../../common/lib/datamodel-ts/index";
import {ImageChain} from "../shared/sdk/models/ImageChain";


/**
 * Encapsulation for a partial set of paintable pixels, giving
 */
const WordPaintInputWrapper = deriveFactoryWrapper<WordPaintInput>(['phrase', 'chain']);

export class WordPaintInput
{
  public readonly phrase: string;
  public readonly chain: ImageChain;

  copy = reflectiveCopyMethodFactory(WordPaintInputWrapper);

  static build = reflectiveBuildMethodFactory(WordPaintInputWrapper,
    WordPaintInput);

  constructor(source: Partial<WordPaintInput>) { Object.assign(self, source); }
}
