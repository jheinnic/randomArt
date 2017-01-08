import builder = require('fluent-interface-builder');
import {unwrapHelper} from "../../../../common/lib/datamodel-ts";
import {buildMethodFactory, ModelBuilder} from "../../../../common/lib/datamodel-ts/index";
import Immutable = require('immutable');
import _ = require('lodash');


//
// Wrapper Implementations
//

const wrapWordPaintTaskData = builder.build<WordPaintTaskDataWrapper,WordPaintTaskData>()
  .chain('phraseToPaint', (phraseToPaint: string) => (context: WordPaintTaskData) => {
    return Object.assign(new WordPaintTaskData(), context, {phraseToPaint: phraseToPaint}) as WordPaintTaskData;
  })
  .chain('width', (width: string) => (context: WordPaintTaskData) => {
    return Object.assign(new WordPaintTaskData(), context, {width: width}) as WordPaintTaskData;
  })
  .chain('height', (height: string) => (context: WordPaintTaskData) => {
    return Object.assign(new WordPaintTaskData(), context, {height: height}) as WordPaintTaskData;
  })
  .unwrap('unwrap', unwrapHelper);


//
// Data Models
//

export class WordPaintTaskData
{
  readonly phraseToPaint: string;
  readonly width: number;
  readonly height: number;

  static build(director: WordPaintTaskDataDirector) {
    let wrapper: WordPaintTaskDataWrapper = wrapWordPaintTaskData.value(new WordPaintTaskData());

    director(wrapper);

    return wrapper.unwrap();
  }

  static build2 = buildMethodFactory(wrapWordPaintTaskData, WordPaintTaskData);

  copy(director: WordPaintTaskDataDirector) {
    let wrapper: WordPaintTaskDataWrapper = wrapWordPaintTaskData.value(this);

    director(wrapper);

    return wrapper.unwrap();

  }
}


//
// Director types
//

export type WordPaintTaskDataDirector = (builder: WordPaintTaskDataBuilder) => void;


//
// Wrapper types
//

type WordPaintTaskDataWrapper =
  {
    phraseToPaint(phraseToPaint: string): WordPaintTaskDataWrapper;
    width(width: number): WordPaintTaskDataWrapper;
    height(height: number): WordPaintTaskDataWrapper;
    unwrap(): WordPaintTaskData;
  }

//
// Builder Interfaces
//

export interface WordPaintTaskDataBuilder extends ModelBuilder<WordPaintTaskData, WordPaintTaskDataBuilder>
{
  phraseToPaint(phraseToPaint: string): WordPaintTaskDataBuilder;
  width(width: number): WordPaintTaskDataBuilder;
  height(height: number): WordPaintTaskDataBuilder;
}
