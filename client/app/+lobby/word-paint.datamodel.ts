/**
 * Created by jheinnic on 12/31/16.
 */
import builder = require('fluent-interface-builder');
import {
  unwrapHelper, copyMethodFactory, BuildMethod, FactoryWrapper, CopyMethod
} from "../../../common/lib/datamodel-ts";
//import * as builder from "fluent-interface-builder";

const wrapWordPaintDataModel = builder.build<WordPaintDataModelWrapper,WordPaintDataModel>()
  .chain(
    'visitReady', (event: CanvasReadyEvent) => (context: WordPaintDataModel) => {
      return new WordPaintDataModel({
        sequenceId: event.sequenceId,
        currentWord: null,
        status: WordPaintStatus.readyForWord,
        pctDone: -1
      });
    }
  )
  .chain(
    'visitUpdate', (event: ProgressUpdateEvent) => (context: WordPaintDataModel) => {
      return new WordPaintDataModel({
        sequenceId: event.sequenceId,
        status: WordPaintStatus.busyPainting,
        currentWord: event.taskWord,
        pctDone: event.pctDone
      });
    }
  )
  .chain(
    'visitCancelled', (event: TaskCancelledEvent) => (context: WordPaintDataModel) => {
      return new WordPaintDataModel({
        sequenceId: event.sequenceId,
        currentWord: null,
        status: WordPaintStatus.readyForWord,
        pctDone: -1,
      });
    }
  )
  .chain(
    'visitCompleted', (event: TaskCompletedEvent) => (context: WordPaintDataModel) => {
      var retVal = new WordPaintDataModel(
        Object.assign({}, context, {
          sequenceId: event.sequenceId,
          status: WordPaintStatus.cleaningUp,
          pctDone: 100.0
        })
      );
      console.log('About to update post-completion state to ' + JSON.stringify(retVal));
      return retVal;
    }
  )
  .unwrap('unwrap', unwrapHelper);


export interface WordPaintDataModelBuilder extends WordPaintEventVisitor
{
  visitReady(event: CanvasReadyEvent) : this;
  visitUpdate(event: ProgressUpdateEvent): this;
  visitCancelled(event: TaskCancelledEvent): this;
  visitCompleted(event: TaskCompletedEvent): this;
}

type WordPaintDataModelWrapper = FactoryWrapper<WordPaintDataModel, WordPaintDataModelBuilder>;

export interface WordPaintEventVisitor
{
  visitReady(event: CanvasReadyEvent);
  visitUpdate(event: ProgressUpdateEvent);
  visitCancelled(event: TaskCancelledEvent);
  visitCompleted(event: TaskCompletedEvent);
}

export abstract class AbstractWordPaintEventVisitor implements WordPaintEventVisitor
{
  visitReady(event: CanvasReadyEvent) { }
  visitUpdate(event: ProgressUpdateEvent) { }
  visitCancelled(event: TaskCancelledEvent) { }
  visitCompleted(event: TaskCompletedEvent) { }
}

export abstract class WordPaintEvent
{
  constructor(readonly sequenceId: number) { }

  abstract accept(visitor: WordPaintEventVisitor): void;
}

export class CanvasReadyEvent extends WordPaintEvent
{
  constructor(sequenceId: number) {
    super(sequenceId);
  }

  accept(visitor: WordPaintEventVisitor) {
    visitor.visitReady(this);
  }
}

export class ProgressUpdateEvent extends WordPaintEvent
{
  constructor(sequenceId: number, readonly taskWord: string, readonly pctDone: number) {
    super(sequenceId);
  }

  accept(visitor: WordPaintEventVisitor) {
    visitor.visitUpdate(this);
  }
}

export class TaskCancelledEvent extends WordPaintEvent
{
  constructor(sequenceId: number, readonly taskWord: string) {
    super(sequenceId);
  }

  accept(visitor: WordPaintEventVisitor) {
    visitor.visitCancelled(this);
  }
}

export class TaskCompletedEvent extends WordPaintEvent
{
  constructor(sequenceId: number, readonly taskWord: string) {
    super(sequenceId);
  }

  accept(visitor: WordPaintEventVisitor) {
    visitor.visitCompleted(this);
  }
}

export enum WordPaintStatus {
  notInitialized,
  readyForWord,
  busyPainting,
  cleaningUp
}

interface WordPaintDataInterface {
  sequenceId: number;
  status?: WordPaintStatus;
  currentWord?: string|null;
  pctDone?: number;
};

export class WordPaintDataModel
{
  readonly sequenceId: number;
  readonly status: WordPaintStatus;
  readonly currentWord: string|null;
  readonly pctDone: number;

  readonly copy: CopyMethod<WordPaintDataModel, WordPaintDataModelBuilder>;

  constructor(content?: WordPaintDataInterface) {
    console.log( 'This: ', JSON.stringify(this), ' & that: ' + JSON.stringify(content));
    Object.assign(this, content);
    this.copy = copyMethodFactory(wrapWordPaintDataModel);
  }
}
