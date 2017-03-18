/**
 * Created by jheinnic on 2/12/17.
 */
import {
  deriveFactoryWrapper, copyMethodFactory, buildMethodFactory, Partial, FactoryWrapper,
  ReflectiveFluentBuilder
} from "../../../common/lib/datamodel-ts/index";
import {Builder} from "fluent-interface-builder";


/**
 * Encapsulation for a partial set of paintable pixels, giving
 */
const wordPaintResultWrapper: Builder<FactoryWrapper<WordPaintResult, ReflectiveFluentBuilder<WordPaintResult>>, WordPaintResult> =
deriveFactoryWrapper<WordPaintResult>(['imageData']);

export class WordPaintResult
{
  public readonly imageData: Blob;

  static build =
    buildMethodFactory(wordPaintResultWrapper, WordPaintResult);

  constructor() { }
}
