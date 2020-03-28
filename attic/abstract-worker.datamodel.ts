/**
 * Created by jheinnic on 1/2/17.
 */
import builder = require('fluent-interface-builder');
import {
  KeyToValue, FactoryWrapper, Partial, unwrapHelper
} from "../../../../common/lib/datamodel-ts";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {AccessTokenInterface} from "../sdk/models/BaseModels";
import {PaintProgress} from "../../pool/create-images-activity.datamodel";
import {Builder} from "fluent-interface-builder";


export type LifecycleStage = 'BOOTSTRAP' | 'READY' | 'ACTIVE' | 'PAUSED' | 'FINISHED' | 'CANCELLED' | 'MAY_RETRY' | 'FAILED' | 'EXCEPTION';
export type LifecycleKeys = KeyToValue<LifecycleStage>;
export const STATE: LifecycleKeys = {
  BOOTSTRAP: 'BOOTSTRAP',
  READY: 'READY',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  FINISHED: 'FINISHED',
  CANCELLED: 'CANCELLED',
  MAY_RETRY: 'MAY_RETRY',
  FAILED: 'FAILED',
  EXCEPTION: 'EXCEPTION'
};

/**
 * Error severity
 * -- Soft errors indicate the current task failed, but may be retried with some possibility of
 * success on next attempt.
 * -- Hard errors indicate the current task failed and will never succeed if retried.
 * -- Fatal errors indicate that the current task failed for an unknown reason and that the
 *    coomponent may be unable to handle additional tasks without being reset.
 *
 * The terminal state transiitons available depend on the success/error status:
 * -- No error: Only begin(), reset(), and repeat() supported
 * -- Soft Error: Only begin(), reset(), and retry() supported
 *    -- Note that cancel() is a special state of soft error.
 *       -- Its onXXX handling options are identical to those allowed by soft errors, but
 *          it triggers an onCancel event, not an onSoftError event.
 *       -- This is why CANCELING is a transition, but there is no CANCELLED lifecycle stage.
 * -- Hard Error: Only begin() and reset() supported
 * -- Fatal Error: Only reset() supported
 */
export enum ErrorSeverity { SOFT, HARD, FATAL }


export abstract class AbstractWorker<T>
{
  private state: LifecycleStage;

  constructor(
    base?: AbstractWorker<T>, delta?: Partial<AbstractWorker<T>>
  ) {
    Object.assign(this, base || {}, delta || {});
 }

  public needsConfig() { return this.state === STATE.BOOTSTRAP; }
  public isReady() { return this.state === STATE.READY; }
  public isPaused(): boolean { return (this.state === STATE.PAUSED); }
  public isWorking(): boolean { return (this.state === STATE.ACTIVE); }
  public isFinished() { return this.state === STATE.FINISHED; }
  public isCancelled() { return this.state === STATE.CANCELLED; }
  public isSoftFailure() { return this.state === STATE.MAY_RETRY; }
  public isHardFailure() { return this.state === STATE.FAILED; }
  public isExceptionalFailure() { return this.state === STATE.EXCEPTION; }
  protected needsInput() { return this.state !== STATE.ACTIVE; }

  public isError() {
    return this.isSoftFailure() || this.isHardFailure() || this.isExceptionalFailure();
  }

  public mayPause() { return this.isWorking(); }
  public mayResume() { return this.isPaused(); }
  public mayCancel() { return this.isWorking() || this.isPaused(); }
  public mayAcknowledge() {
    return (this.isFinished() || this.isSoftFailure() || this.isHardFailure()
    || this.isCancelled());
  }

  public mustReset() { return this.isExceptionalFailure(); }
  public mayReset(): boolean { return this.isReady() || this.mayAcknowledge(); }
  protected mayRetry() { return this.isSoftFailure() || this.isCancelled(); }
}

export interface BootstrapWorker<T>
{
  readonly state: 'BOOTSTRAP';
  // readonly mixin: MIXIN;

  ready(): ReadyWorker<T>;
}

export interface ReadyWorker<T>
{
  readonly state: 'READY';

  begin(task: T): ActiveWorker<T>;
}

export interface ActiveWorker<T>
{
  readonly state: 'ACTIVE';
  readonly currentTask: T;

  pause(): PausedWorker<T>;
  cancel(): CancelledWorker<T>;
  finish(): FinishedWorker<T>;
  // beforeError(severity: ErrorSeverity, error: any): MIXIN;
}


export interface PausedWorker<T>
{
  readonly state: 'PAUSED';
  // readonly mixin: MIXIN;
  readonly currentTask: T;

  resume(): ActiveWorker<T>;
  cancel(): CancelledWorker<T>;
  // beforeError(severity: ErrorSeverity, error: any): MIXIN;
}

export interface CancelledWorker<T>
{
  readonly state: 'CANCELLED',
  // readonly mixin: MIXIN;
  readonly currentTask: T;

  acknowledge(task: T): ReadyWorker<T>;
  retry(): ActiveWorker<T>;
  reset(): BootstrapWorker<T>;
}

export interface FinishedWorker<T>
{
  readonly state: 'FINISHED',
  // readonly mixin: MIXIN;
  readonly currentTask: T;
  readonly result: any;

  acknowledge(task: T): ReadyWorker<T>;
  reset(): BootstrapWorker<T>;
}

/*
export interface SoftErrorWorker<T>
{
  readonly state: 'MAY_RETRY',
  readonly mixin: MIXIN;
  readonly currentTask: T;
  readonly err: any;

  acknowledge(task: T): MIXIN;
  retry(): MIXIN;
  reset(): MIXIN;
}

export interface HardErrorWorker<T>
{
  readonly state: 'FAILED',
  readonly mixin: MIXIN;
  readonly currentTask: T;
  readonly err: any;

  acknowledge(task: T): MIXIN;
  reset(): MIXIN;
}

export interface FatalErrorWorker<T>
{
  readonly state: 'EXCEPTION',
  readonly mixin: MIXIN;
  readonly currentTask: T;
  readonly err: any;

  reset(): MIXIN;
}
*/


export type Worker<T> = BootstrapWorker<T> | ReadyWorker<T> | ActiveWorker<T> | PausedWorker<T> | CancelledWorker<T> | FinishedWorker<T>; // | SoftErrorWorker<T> | HardErrorWorker<T> | FatalErrorWorker<T>;

// export interface WorkerFactory<T,B extends BootstrapWorker<T>, R extends
// ReadyWorker<T>, A extends ActiveWorker<T>, Q extends PausedWorker<T>, C extends CancelledWorker<T>, F extends FinishedWorker<T>, S extends SoftErrorWorker<T>, H extends HardErrorWorker<T>, Z extends FatalErrorWorker<T>>
export interface WorkerFactory<T> {
  createBootstrap<L extends BootstrapWorker<T>>(base?: Worker<T>, deltas?: Partial<L>): L;
  createReady<L extends ReadyWorker<T>>(base?: Worker<T>, deltas?: Partial<L>): L;
  createActive<L extends ActiveWorker<T>>(base?: Worker<T>, deltas?: Partial<L>): L;
  createPaused<L extends PausedWorker<T>>(base?: Worker<T>, deltas?: Partial<L>): L;
  createCancelled<L extends CancelledWorker<T>>(base?: Worker<T>, deltas?: Partial<L>): L;
  createFinished<L extends FinishedWorker<T>>(base?: Worker<T>, deltas?: Partial<L>): L;
  // createSoftError<L extends SoftErrorWorker<T>>(base?: Worker<T>, deltas?: Partial<L>): L;
  // createHardError<L extends HardErrorWorker<T>>(base?: Worker<T>, deltas?: Partial<L>): L;
  // createFatalError<L extends FatalErrorWorker<T>>(base?: Worker<T>, deltas?: Partial<L>): L;
}

// Model Builder API

export interface WorkerModelBuilder<T>
{
  ready(): this;
  begin(task: T): this;
  pause(): this;
  resume(): this;
  cancel(): this;
  finish(): this;
  retry(): this;
  // reset(): this;
  acknowledge(task: T): this;
  softError(err: any): this;
  hardError(err: any): this;
  fatalError(err: any): this;
}


//
// Director types
//

export type WorkerDirector<T> = (builder: WorkerModelBuilder<T>) => void;


//
// FactoryWrapper types for creation call signatures.
//

export type WorkerFactoryWrapper<T> = FactoryWrapper<Worker<T>, WorkerModelBuilder<T>>;


//
// Model Builder Implementation
//

export function getBlankBuilderWrapper<T>(): Builder<WorkerFactoryWrapper<T>,Worker<T>> {
  return builder.build<WorkerFactoryWrapper<T>, Worker<T>>()
}

  export function initBuilderWrapper<T,M extends WorkerModelBuilder<T>>(
    util: Builder<FactoryWrapper<Worker<T>,WorkerModelBuilder<T>>,Worker<T>>, factory: WorkerFactory<T>) {
    return util.chain('ready', () => (context: Worker<T>) => {
      let retVal: ReadyWorker<T>;
      switch (context.state) {
        case STATE.BOOTSTRAP:
          // let mixin:MIXIN = context.ready();
          if (mixin !== null) {
            retVal = factory.createReady(context, {state: STATE.READY, mixin:mixin});
          } else {
            throw new Error("Cannot complete initialization with incomplete configuration.");
          }
          break;
        default:
          throw new Error("Invalid state: " + context.state);
      }
      return retVal;
    })
    .chain('begin', (task: T) => (context: Worker<T>) => {
      let retVal: ActiveWorker<T>;
      switch (context.state) {
        case STATE.READY:
          let mixin = context.begin(task);
          if (mixin !== null) {
            retVal = factory.createActive(context, {
              state: STATE.ACTIVE,
              mixin: mixin,
              currentTask: task
            });
          } else {
            throw new Error("Task was rejected: " + task);
          }
          break;
        default:
          throw new Error("Invalid state: " + context.state);
      }
      return retVal;
    })
    .chain('pause', () => (context: Worker<T>) => {
      let retVal: PausedWorker<T>;
      switch (context.state) {
        case STATE.ACTIVE:
          if (context.beforePause()) {
            retVal = factory.createPaused(this.context, {state: STATE.PAUSED});
            retVal.pause();
          } else {
            throw new Error("Cannot pause");
          }
          break;
        default:
          throw new Error("Invalid state: " + context.state);
      }
      return retVal;
    })
    .chain('resume', () => (context: Worker<T>) => {
      let retVal: ActiveWorker<T>;
      switch (context.state) {
        case STATE.PAUSED:
          if (context.beforeResume()) {
            retVal = factory.createActive(this.context, {state: STATE.ACTIVE});
            retVal.resume();
          } else {
            throw new Error("Cannot resume");
          }
          break;
        default:
          throw new Error("Invalid state: " + context.state);
      }
      return retVal;
    })
    .chain('cancel', () => (context: Worker<T>) => {
      let retVal: CancelledWorker<T>;
      switch (context.state) {
        case STATE.ACTIVE:
        case STATE.PAUSED:
          if (context.beforeCancel()) {
            retVal = factory.createCancelled(this.context, {state: STATE.CANCELLED});
            retVal.cancel();
          } else {
            throw new Error("Cannot cancel");
          }
          break;
        default:
          throw new Error("Invalid state: " + context.state);
      }
      return retVal;
    })
    .chain('finish', () => (context: Worker<T>) => {
      let retVal: FinishedWorker<T>;
      switch (context.state) {
        case STATE.ACTIVE:
          if (context.beforeFinish()) {
            retVal = factory.createFinished(this.context, {state: STATE.FINISHED});
            retVal.finish();
          } else {
            throw new Error("Cannot resume");
          }
          break;
        default:
          throw new Error("Invalid state: " + context.state);
      }
      return retVal;
    })
    .chain('retry', () => (context: Worker<T>) => {
      let retVal: ActiveWorker<T>;

      switch (context.state) {
        case STATE.CANCELLED:
        case STATE.MAY_RETRY:
          if (context.beforeRetry()) {
            retVal = factory.createActive(this.context, {state: STATE.ACTIVE});
            retVal.retry();
          } else {
            throw new Error("Cannot resume");
          }
          break;
        default:
          throw new Error("Invalid state: " + context.state);
      }
      return retVal;
    })
    .chain('acknowledge', (task: T) => (context: Worker<T>) => {
      let retVal: ReadyWorker<T>;
      switch (context.state) {
        case STATE.FINISHED:
        case STATE.CANCELLED:
        case STATE.MAY_RETRY:
        case STATE.FAILED:
          if (context.acknowledge(task)) {
            retVal = factory.createReady(this.context, {state: STATE.READY});
            retVal.ready();
          } else {
            throw new Error("Cannot resume");
          }
          break;
        default:
          throw new Error("Invalid state: " + context.state);
      }
      return retVal;
    })
    .chain('softError', (err: any) => (context: Worker<T>) => {
      let retVal: SoftErrorWorker<T>;
      switch (context.state) {
        case STATE.PAUSED:
        case STATE.ACTIVE:
          context.beforeError(ErrorSeverity.SOFT, err);
          retVal = factory.createSoftError(this.context, {
            state: STATE.MAY_RETRY,
            err: err
          });
          retVal.softError(err);
          break;
        default:
          throw new Error("Invalid state: " + context.state);
      }
      return retVal;
    })
    .chain('hardError', (err: any) => (context: Worker<T>) => {
      let retVal: HardErrorWorker<T>;
      switch (context.state) {
        case STATE.PAUSED:
        case STATE.ACTIVE:
          context.beforeError(ErrorSeverity.HARD, err);
          retVal = factory.createHardError(this.context, {
            state: STATE.FAILED,
            err: err
          });
          retVal.hardError(err);
          break;
        default:
          throw new Error("Invalid state: " + context.state);
      }
      return retVal;
    })
    .chain('fatalError', (err: any) => (context: Worker<T>) => {
      let retVal: FatalErrorWorker<T>;
      switch (context.state) {
        case STATE.PAUSED:
        case STATE.ACTIVE:
          context.beforeError(ErrorSeverity.FATAL, err);
          retVal = factory.createFatalError(this.context, {
            state: STATE.EXCEPTION,
            err: err
          });
          retVal.fatalError(err);
          break;
        default:
          throw new Error("Invalid state: " + context.state);
      }
      return retVal;
    })
    .unwrap('unwrap', unwrapHelper);
}
