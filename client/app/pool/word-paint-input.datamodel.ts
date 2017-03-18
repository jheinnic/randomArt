/**
 * Created by jheinnic on 2/12/17.
 */
import {
  deriveFactoryWrapper, copyMethodFactory, buildMethodFactory, ReflectiveFluentBuilder,
  FactoryWrapper, Partial
} from "../../../common/lib/datamodel-ts/index";
import {ImageChain} from "../shared/sdk/models/ImageChain";
import {Builder} from "fluent-interface-builder";


/**
 * Encapsulation for a partial set of paintable pixels, giving
 */
const wordPaintInputWrapper:Builder<FactoryWrapper<WordPaintInput,ReflectiveFluentBuilder<WordPaintInput>>,Partial<WordPaintInput>> =
  deriveFactoryWrapper<WordPaintInput>(['phrase', 'chain']);

export class WordPaintInput
{
  // public readonly kind = 'word';
  public readonly phrase: string;
  public readonly chain: ImageChain;

  copy = copyMethodFactory<WordPaintInput,ReflectiveFluentBuilder<WordPaintInput>,FactoryWrapper<WordPaintInput,ReflectiveFluentBuilder<WordPaintInput>>>(wordPaintInputWrapper);

  static build =
    buildMethodFactory<WordPaintInput,ReflectiveFluentBuilder<WordPaintInput>,FactoryWrapper<WordPaintInput,ReflectiveFluentBuilder<WordPaintInput>>>(wordPaintInputWrapper, WordPaintInput);

  constructor() { }
}
