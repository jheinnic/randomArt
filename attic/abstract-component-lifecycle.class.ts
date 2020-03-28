/**
 * Created by jheinnic on 1/2/17.
 */
// import {EventEmitter, NgZone} from "@angular/core";
// import {Subscription, Observable, BehaviorSubject, Subject} from "rxjs";
// import {TaskProgress, TaskError} from "./task.datamodel";
// import uuid = require('uuid');
// import _ = require('lodash');

export enum LifecycleStage {
  INITIALIZING, READY, WORKING, PAUSING, PAUSED, RESUMING, CANCELING, FINISHED, FAILED
}

// export enum LifecycleTransition {
//   STABLE, PAUSING, CANCELING
// }
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
 *    -- Note that cancel() is a special kind of soft error.
 *       -- Its onXXX handling options are identical to those allowed by soft errors, but
 *          it triggers an onCancel event, not an onSoftError event.
 *       -- This is why CANCELING is a transition, but there is no CANCELED lifecycle stage.
 * -- Hard Error: Only begin() and reset() supported
 * -- Fatal Error: Only reset() supported
 */
export enum ErrorSeverity { SOFT, HARD, FATAL }

export class AbstractComponentLifecycle<T>
{
  private state: LifecycleStage = LifecycleStage.INITIALIZING;
  private severity: ErrorSeverity = undefined;

  /*
  private activeTask: T = undefined;
  private activeStep: S = undefined;
  private latestProgress: P = undefined;
  private stepStream: Observable<S> = undefined;
  private progressStream: Subject<P> = new Subject<P>();
  private initialProgress: Subject<P> = new Subject<P>();

  private noProgressQueue: Observable<S> = Observable.never<S>();
  private stepFlowFeed: BehaviorSubject<Observable<S>> =
    new BehaviorSubject<Observable<S>>(this.noProgressQueue);
  private stepFlowGate: Observable<S> = undefined;

  private _liveDelayDuration: number = 750;
  // private actualDelayDuration: number = 0;

  private progressSubscription: Subscription = undefined;

  private readonly softSubscription: Subscription;
  private readonly hardSubscription: Subscription;
  private readonly fatalSubscription: Subscription;
  protected readonly onAnyError: EventEmitter<[ErrorSeverity, TaskError<T,S,P>]>;

  protected constructor(
    protected readonly ngZone: NgZone,
    protected readonly onReset: EventEmitter<void> = new EventEmitter<void>(),
    protected readonly onReady: EventEmitter<void> = new EventEmitter<void>(),
    protected readonly onBegin: EventEmitter<T> = new EventEmitter<T>(),
    protected readonly onDone: EventEmitter<P> = new EventEmitter<P>(),
    protected readonly onPause: EventEmitter<void> = new EventEmitter<void>(),
    protected readonly onResume: EventEmitter<void> = new EventEmitter<void>(),
    protected readonly onCancel: EventEmitter<void> = new EventEmitter<void>(),
    protected readonly onProgress: EventEmitter<TaskProgress<T,S,P>> = new EventEmitter<TaskProgress<T,S,P>>(),
    protected readonly onSoftError: EventEmitter<TaskError<T,S,P>> = new EventEmitter<TaskError<T,S,P>>(),
    protected readonly onHardError: EventEmitter<TaskError<T,S,P>> = new EventEmitter<TaskError<T,S,P>>(),
    protected readonly onFatalError: EventEmitter<TaskError<T,S,P>> = new EventEmitter<TaskError<T,S,P>>()
  ) {

    this.onAnyError = new EventEmitter<[ErrorSeverity, TaskError<T,S,P>]>(false);
    this.softSubscription = this.onSoftError.subscribe((next) => {
      this.onAnyError([ErrorSeverity.SOFT, next]);
    });
    this.hardSubscription = this.onHardError.subscribe((next) => {
      this.onAnyError([ErrorSeverity.HARD, next]);
    });
    this.fatalSubscription = this.onFatalError.subscribe((next) => {
      this.onAnyError([ErrorSeverity.FATAL, next]);
    });

  }

  public ngOnDestroy() {
    this.softSubscription.unsubscribe();
    this.hardSubscription.unsubscribe();
    this.fatalSubscription.unsubscribe();
    this.progressSubscription.unsubscribe();
  }
  */

  protected onReady() { }

  protected onBegin(task: T) { }

  protected onPause() { }

  protected onResume() { }

  protected onCancel() { }

  protected onDone() { }

  protected onRecycle() { }

  protected onReset() { }

  protected onError( error: any ) { }


  //
  // Stable State -- Iniitialization
  // The host triggers these and this directive records the observation.

  protected ready() {
    if (this.state === LifecycleStage.INITIALIZING) {
      this.onReady();

      this.state = LifecycleStage.READY;
    }
  };

  protected begin(task: T) {
    if (this.isReady()) {
      this.onBegin(task);

      this.state = LifecycleStage.WORKING;
    }
  }

  protected pause() {
    if (this.isWorking()) {
      this.state = LifecycleStage.PAUSING;
      this.onPause();

      if (this.isPausing()) {
        this.state = LifecycleStage.PAUSED;
      } else if (this.isResuming()) {
        this.onResume();
        this.state = LifecycleStage.WORKING;
      } else {
        console.error("Unexpected state following call to onPause()", this.state);
      }
    }
  }

  protected resume() {
    if (this.isPaused()) {
      this.onResume();
      this.state = LifecycleStage.WORKING;
    } else if (this.isPausing()) {
      this.state = LifecycleStage.RESUMING;
    }
  }

  protected cancel() {
    if (this.mayCancel()) {
      this.state = LifecycleStage.CANCELING;
      this.onCancel();
      this.state = LifecycleStage.FAILED;
      this.severity = ErrorSeverity.SOFT
    }
  }

  protected recycle() {
   if (this.mayRecycle()) {
     this.onRecycle();
     this.state = LifecycleStage.READY;
      this.severity = undefined;
     this.onReady();
   }
  }

  protected done() {
    if (this.isWorking()) {
      this.state = LifecycleStage.FINISHED;
      this.onDone();
    }
  }

  protected reset() {
    if (this.mayReset()) {
      this.onReset();
      this.state = LifecycleStage.INITIALIZING;
      this.severity = undefined;
    }
  }

  protected retry() {
    throw new Error("TODO");
  }

  protected repeat() {
    throw new Error("TODO");
  }

  protected error(
    error: any, severity: ErrorSeverity = ErrorSeverity.SOFT
  ) {
    if (this.state === LifecycleStage.WORKING) {
      this.state = LifecycleStage.FAILED;
      this.severity = severity;
      this.onError(error);
    }
  }

  // State inspection shortcuts

  public isReady() {
    return this.state === LifecycleStage.READY;
  }

  public isPausing(): boolean {
    return (this.state === LifecycleStage.PAUSING);
  }

  public isPaused(): boolean {
    return (this.state === LifecycleStage.PAUSED);
  }

  public isResuming(): boolean {
    return (this.state === LifecycleStage.RESUMING);
  }

  public isWorking(): boolean {
    return (this.state === LifecycleStage.WORKING);
  }

  public isCanceling() {
    return this.state === LifecycleStage.CANCELING;
  }

  public mayCancel() {
    return this.isWorking() || this.isPausing() || this.isPaused() || this.isResuming();
  }

  public mayConfigure() {
    return this.state === LifecycleStage.INITIALIZING;
  }

  public hasFinished() {
    return this.state === LifecycleStage.FINISHED;
  }

  public hasFailed() {
    return this.state === LifecycleStage.FAILED;
  }

  public isTerminal() {
    return (this.hasFinished() || this.hasFailed());
  }

  get errorSeverity(): ErrorSeverity {
    return (this.hasFailed() ? this.severity : undefined);
  }

  public mayRecycle(): boolean {
    return (this.hasFinished() || (this.hasFailed() && this.severity !== ErrorSeverity.FATAL));
  }

  public mustReset() {
    return this.hasFailed() && this.severity === ErrorSeverity.FATAL;
  }

  public mayReset(): boolean {
    return this.isReady() || this.hasFailed() || this.hasFinished()
  }

  protected mayRetry() {
    return this.hasFailed() && this.severity === ErrorSeverity.SOFT;
  }

  protected mayRepeat() {
    return this.hasFinished();
  }
}

