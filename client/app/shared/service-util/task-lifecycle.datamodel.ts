/**
 * Created by jheinnic on 2/2/17.
 */
import {BehaviorSubject, Observable} from "rxjs";
import {KeyToValue} from "../../../../common/lib/datamodel-ts/index";

export type TaskLifecycleStage = 'pending' | 'active' | 'suspended' | 'abandoned' | 'done' | 'retryable' | 'failed' | 'closed';
export type TaskEventKind = 'new' | 'began' | 'progress' | 'paused' | 'resumed' | 'finished' | 'cancelled' | 'softError' | 'hardError' | 'acknowledged' | 'retried';

export const TaskStage: KeyToValue<TaskLifecycleStage> = {
  pending: 'pending',
  active: 'active',
  done: 'done',
  suspended: 'suspended',
  abandoned: 'abandoned',
  retryable: 'retryable',
  failed: 'failed',
  closed: 'closed'
};

export interface NewTaskEvent<Task,Progress,Result>
{
  kind: 'new';
  task: Task;
}

export interface BeganTaskEvent<Task,Progress,Result>
{
  kind: 'began';
  task: Task;
}

export interface ProgressTaskEvent<Task,Progress,Result>
{
  kind: 'progress';
  task: Task;
  progress: Progress;
}

export interface PausedTaskEvent<Task,Progress,Result>
{
  kind: 'paused';
  task: Task;
}

export interface ResumedTaskEvent<Task,Progress,Result>
{
  kind: 'resumed';
  task: Task;
}

export interface CancelledTaskEvent<Task,Progress,Result>
{
  kind: 'cancelled';
  task: Task;
}

export interface FinishedTaskEvent<Task,Progress,Result>
{
  kind: 'finished';
  task: Task;
  result: Result;
}

export interface SoftErrorTaskEvent<Task,Progress,Result>
{
  kind: 'softError';
  task: Task;
  error: any;
}

export interface HardErrorTaskEvent<Task,Progress,Result>
{
  kind: 'hardError';
  task: Task;
  error: any;
}

export interface AcknowledgedTaskEvent<Task,Progress,Result>
{
  kind: 'acknowledged';
  task: Task;
}

export interface RetriedTaskEvent<Task,Progress,Result> {
  kind: 'retried';
  task: Task;
}

export type TaskEventType<Task,Progress,Result> = NewTaskEvent<Task,Progress,Result> | BeganTaskEvent<Task,Progress,Result> | ProgressTaskEvent<Task,Progress,Result> | PausedTaskEvent<Task,Progress,Result> | ResumedTaskEvent<Task,Progress,Result> | CancelledTaskEvent<Task,Progress,Result> | FinishedTaskEvent<Task,Progress,Result> | SoftErrorTaskEvent<Task,Progress,Result> | HardErrorTaskEvent<Task,Progress,Result> | RetriedTaskEvent<Task,Progress,Result> | AcknowledgedTaskEvent<Task,Progress,Result>;

/**
 * Abstract base class for a worker with a lifecycle, with a set of base properties that
 * is the union of all event interface types.  This facilitates a pattern where changes in
 * lifecycle's state machine are coincident to immutable reconstruction.  This in turn
 * promotes use of the service worker's lifecycle state engine object itself as the lifecycle
 * event payload.
 */
export class AbstractTask<Task,Progress,Result>
{
  private _stage: TaskLifecycleStage = 'pending';
  protected readonly onTaskEvent: BehaviorSubject<TaskEventType<Task,Progress,Result>>;

  protected progress: Progress;
  protected result: Result;
  protected error: any;

  constructor(public readonly task: Task) {
    this.onTaskEvent = new BehaviorSubject<TaskEventType<Task,Progress,Result>>({
      kind: 'new',
      task: task
    });
  }

  private assertTransition(from: TaskLifecycleStage, to: TaskLifecycleStage) {
    if (this._stage !== from) {
      throw new Error(`Cannot transition from ${from} while current state is ${this._stage}`);
    }

    let nextEvent;
    switch(`${from}->${to}`) {
      case 'pending->active':
        nextEvent = { kind: 'began', task: this.task };
        break;
      case 'suspended->active':
        nextEvent = { kind: 'resumed', task: this.task };
        break;
      case 'active->suspended':
        nextEvent = { kind: 'paused', task: this.task };
        break;
      case 'active->abandoned':
        nextEvent = { kind: 'cancelled', task: this.task };
        break;
      case 'active->done':
        nextEvent = { kind: 'finished', task: this.task, result: this.result };
        break;
      case 'active->retryable':
        nextEvent = { kind: 'softError', task: this.task, error: this.error };
        break;
      case 'active->failed':
        nextEvent = { kind: 'hardError', task: this.task, result: this.error };
        break;
      case 'done->closed':
      case 'abandoned->closed':
      case 'retryable->closed':
      case 'failed->closed':
        nextEvent = { kind: 'acknowledged', task: this.task };
        break;
      case 'abandoned->pending':
      case 'retryable->pending':
        nextEvent = { kind: 'retried', task: this.task };
        break;
      default:
        // throw new Error(`Internal error task state changes from ${from} to ${to} are
        // undefined`);
        throw new Error(
          `Cannot transition to ${to} while current state is ${this._stage}`);
    }

    setTimeout(() => {
      this._stage = to;
      this.onTaskEvent.next(nextEvent);
    });
  }
  protected begin() {
    this.assertTransition('pending', 'active');
  }

  protected pause() {
    this.assertTransition('active', 'suspended');
  }

  protected resume() {
    this.assertTransition('suspended', 'active');
  }

  protected cancel() {
    this.assertTransition('active', 'abandoned');
  }

  protected finish(result: Result) {
    this.result = result;
    this.assertTransition('active', 'done');
  }

  protected assert(error: any, retryable: boolean = false) {
    this.error = error;
    if (retryable) {
      this.assertTransition('active', 'retryable');
    } else {
      this.assertTransition('active', 'failed');
    }
  }

  protected retry() {
    this.assertTransition('retryable', 'pending');
  }

  protected acknowledge() {
    switch(this._stage) {
      case 'done':
      case 'retryable':
      case 'failed':
      case 'abandoned':
        this.assertTransition(this._stage, 'closed');
        break;
      default:
        throw new Error(`Cannot transition to closed while current state is ${this._stage}`);
    }
  }

  protected report(progress: Progress) {
    if (this._stage !== 'active') {
      throw new Error(`Progress reports can only be emitted when a task is active, but task is ${this._stage}`);
    }

    setTimeout(() => {
      this.onTaskEvent.next(
        {kind: 'progress', task: this.task, progress: progress});
    }, 0);
  }

  protected get stage(): TaskLifecycleStage {
    return this._stage;
  }

  protected getEvents(): Observable<TaskEventType<Task,Progress,Result>> {
    return this.onTaskEvent.asObservable().do((e) => { console.log('Task Event: ', e);});
  }
}
