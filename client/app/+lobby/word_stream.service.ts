/**
 * Created by jheinnic on 12/26/16.
 */
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {ReplaySubject} from "rxjs/ReplaySubject";
import * as _ from "lodash";

export enum WordPaintEventType {
  modelSnapshot, offerTask, dropTask, beginTask, completeTask, cancelTask
}

export interface WordPaintEvent {
  eventType: WordPaintEventType;
}

export interface WordPaintChangeEvent {
  eventType: WordPaintEventType;
  sequenceId: number;
}

class AbstractWordPaintEvent {
  constructor(readonly eventType: WordPaintEventType, readonly sequenceId: number) {
  }
}

export class ModelSnapshotEvent {
  readonly eventType: WordPaintEventType = WordPaintEventType.modelSnapshot;
  readonly dataModel: WordPaintDataModel;

  constructor(_dataModel: WordPaintDataModel) {
    this.dataModel = _.cloneDeep(_dataModel);
  }
}

export class OfferWordPaintTaskEvent extends AbstractWordPaintEvent {
  constructor(sequenceId: number, readonly taskWord: string) {
    super(WordPaintEventType.offerTask, sequenceId);
  }
}

export class DropWordPaintTaskEvent extends AbstractWordPaintEvent {
  constructor(sequenceId: number, readonly taskWord: string) {
    super(WordPaintEventType.dropTask, sequenceId);
  }
}

export class BeginWordPaintTaskEvent extends AbstractWordPaintEvent {
  constructor(sequenceId: number, readonly taskWord: string) {
    super(WordPaintEventType.beginTask, sequenceId);
  }
}

export class CompleteWordPaintTaskEvent extends AbstractWordPaintEvent {
  constructor(sequenceId: number, readonly taskWord: string) {
    super(WordPaintEventType.completeTask, sequenceId);
  }
}

export class CancelWordPaintTaskEvent extends AbstractWordPaintEvent {
  constructor(sequenceId: number, readonly taskWord: string) {
    super(WordPaintEventType.cancelTask, sequenceId);
  }
}

interface DataModel {
  sequenceId?: number;
  wordQueue?: string[];
  currentWord?: string;
}

export class WordPaintDataModel {
  sequenceId: number;
  wordQueue: string[];
  currentWord?: string;

  constructor(updates: DataModel = {}) {
    Object.assign(this, updates);
  }

  // getNext(updates: DataModel) {
  //   let temp = Object.assign({}, this);
  //   Object.assign(temp, updates);
  //   temp.sequenceId = this.sequenceId + 1;
  //   return new WordPaintDataModel(temp);
  // }
}

@Injectable()
export class WordStreamService {
  private state: WordPaintDataModel = new WordPaintDataModel({sequenceId: 1, wordQueue: []});
  // private taskStream: BehaviorSubject<WordPaintEvent> = new BehaviorSubject<WordPaintEvent>(new ModelSnapshotEvent(this.state));
  private taskStream: ReplaySubject<WordPaintEvent> = new ReplaySubject<WordPaintEvent>(10, 100);
  private observable: Observable<WordPaintEvent> = this.taskStream.asObservable();

  constructor() {
    this.observable.do((event: WordPaintEvent) => {
      let beginEvent: BeginWordPaintTaskEvent;
      let dropEvent: DropWordPaintTaskEvent;
      let completeEvent: CompleteWordPaintTaskEvent;
      console.log('Stream service handles ' + JSON.stringify(event));

      switch (event.eventType) {
        case(WordPaintEventType.beginTask): {
          beginEvent = event as BeginWordPaintTaskEvent;
          this.state = new WordPaintDataModel({
            sequenceId: beginEvent.sequenceId, wordQueue: this.state.wordQueue, currentWord: beginEvent.taskWord
          });
          break;
        }
        case(WordPaintEventType.dropTask): {
          dropEvent = event as DropWordPaintTaskEvent;
          this.state = new WordPaintDataModel({
            sequenceId: dropEvent.sequenceId, wordQueue: this.state.wordQueue, currentWord: this.state.currentWord
          });
          break;
        }
        case(WordPaintEventType.completeTask): {
          completeEvent = event as CompleteWordPaintTaskEvent;
          this.state = new WordPaintDataModel({
            sequenceId: completeEvent.sequenceId, wordQueue: this.state.wordQueue, currentWord: undefined
          });
          break;
        }
      }

      console.log('Stream service leaves state object as ' + JSON.stringify(this.state));
    })
  }

  public getTaskStream(): Observable<WordPaintEvent> {
    return this.observable.startWith(new ModelSnapshotEvent(this.state));
  }

  public submitNextTask(task: string) {
    if (_.isString(this.state.currentWord)) {
      this.taskStream.next(new DropWordPaintTaskEvent(this.state.sequenceId + 1, task));
    } else {
      this.taskStream.next(new BeginWordPaintTaskEvent(this.state.sequenceId + 1, task));
    }
  }

  public finishTask(task: string) {
    console.log('Stream service asked to send finishTask for ' + task + ' with state = ' + JSON.stringify(this.state));
    if (this.state.currentWord === task) {
      this.taskStream.next(new CompleteWordPaintTaskEvent(this.state.sequenceId + 1, this.state.currentWord));
    }
  }

  public cancelTask(task: string) {
    if (this.state.currentWord === task) {
      this.taskStream.next(new CancelWordPaintTaskEvent(this.state.sequenceId + 1, this.state.currentWord));
    }
  }

  public reportProgress(task: string, pctDone: number) {
    // TODO
    console.log(task + ' is ' + pctDone + ' done.');
  }
}
