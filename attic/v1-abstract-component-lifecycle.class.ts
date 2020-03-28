/**
 * Created by jheinnic on 1/2/17.
 */
import {EventEmitter, NgZone} from "@angular/core";
import {Subscription, Observable, BehaviorSubject, Subject} from "rxjs";
import {TaskProgress, TaskError} from "./task.datamodel";
import uuid = require('uuid');
import _ = require('lodash');

export enum LifecycleStage {
  INITIALIZING, READY, WORKING, PAUSING, PAUSED, CANCELING, FINISHED, FAILED
}

export enum LifecycleTransition {
  STABLE, PAUSING, CANCELING
}
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

export class V1AbstractComponentLifecycle<T,S,P>
{
  private state: LifecycleStage = LifecycleStage.INITIALIZING;
  private severity: ErrorSeverity = undefined;

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
      this.onAnyError.emit([ErrorSeverity.SOFT, next]);
    });
    this.hardSubscription = this.onHardError.subscribe((next) => {
      this.onAnyError.emit([ErrorSeverity.HARD, next]);
    });
    this.fatalSubscription = this.onFatalError.subscribe((next) => {
      this.onAnyError.emit([ErrorSeverity.FATAL, next]);
    });

  }

  public ngOnDestroy() {
    this.softSubscription.unsubscribe();
    this.hardSubscription.unsubscribe();
    this.fatalSubscription.unsubscribe();
    this.progressSubscription.unsubscribe();
  }

  //
  // Stable State -- Iniitialization
  // The host triggers these and this directive records the observation.

  get liveDelayDuration(): number {
    return this._liveDelayDuration;
  }

  set liveDelayDuration(value: number) {
    if (this.state === LifecycleStage.INITIALIZING) {
      this._liveDelayDuration = value;
    } else {
      console.error("Can only change current live delay duration before ready() is called");
    }
  }

  protected ready() {
    if (this.state === LifecycleStage.INITIALIZING) {
      this.state = LifecycleStage.READY;

      this.progressSubscription = this.stepFlowFeed.asObservable()
        .switch()
        .zip(
          this.initialProgress.merge(
            this.progressStream.delay(this.liveDelayDuration)))
        .subscribe((next: [S, P]) => {
          this.activeStep = next[0];
          if (this.latestProgress !== next[1]) {
            console.error("Progress flow mismatch at ", next[0], this.latestProgress, next[1]);
          }

          switch (this.state) {
            case LifecycleStage.CANCELING:
              this.state = LifecycleStage.FAILED;
              this.severity = ErrorSeverity.SOFT;
              this.stepFlowFeed.next(this.noProgressQueue);
              break;
            case LifecycleStage.PAUSING:
              this.state = LifecycleStage.PAUSED;
              this.severity = undefined;
              this.stepFlowFeed.next(this.noProgressQueue);
              break;
            case LifecycleStage.WORKING:
              this.ngZone.runOutsideAngular(() => {
                setTimeout(() => {
                  const latestProgress = this.doWorkStep(this.activeStep);
                  const nextEvent = new TaskProgress(undefined, {
                    activeTask: this.activeTask,
                    latestStep: this.activeStep,
                    latestProgress: latestProgress
                  });
                  this.ngZone.run(() => {
                    this.latestProgress = latestProgress;
                    this.onProgress.emit(nextEvent);
                  });
                  this.progressStream.next(latestProgress);
                }, 0);
              });
              break;
            default:
              throw new Error(`Unexpected state ${this.state}`);
          }
        });

      this.onReady.emit();
    }
  };


  //
  // Component "On Active" extension points
  //
  // Always invoked outside the Angular zone, this implements the entry points triggered by
  // calling begin( ) or resume( ) from inside the angular zone.  Implementation methods are
  // no longer obligated to periodicaly call checkProgress(T, S), but rather can expect to
  // have been called from within the previous iteration's framework call into that method.

  protected doWorkStep(workStep: S): P { return null; }


  protected begin(task: T, steps: Observable<S>, initialProgress: P) {
    if (this.isReady()) {
      this.state = LifecycleStage.WORKING;

      this.activeTask = task;
      this.stepStream = steps.finally(() => {
        this.stepFlowFeed.next(this.noProgressQueue);
        this.onDone.emit();
      });
      this.latestProgress = initialProgress;

      this.onBegin.emit(task);

      this.stepFlowFeed.next(this.stepStream);
      this.initialProgress.next(initialProgress);
    }
  }

//
// Application stage transition initiator methods
// (These trigger events the host is expected to respond to and then acknowledge)

  public pause() {
    if (this.isWorking()) {
      this.state = LifecycleStage.PAUSING;
    }
  }

  public resume() {
    if (this.isPaused()) {
      this.state = LifecycleStage.WORKING;
      const skipWhileTarget = this.activeStep;

      this.onResume.emit();

      this.stepFlowFeed.next(
        this.stepStream.skipWhile(
          (val: S): boolean => { return val !== skipWhileTarget; }
        )
      );

      this.initialProgress.next(this.latestProgress);
    } else if (this.isPausing()) {
      this.state = LifecycleStage.WORKING;

      this.onPause.emit();
      this.onResume.emit();
    }
  }

  public cancel() {
    if (this.mayCancel()) {
      this.state = LifecycleStage.CANCELING;
    }
  }

  public release() {
   if (this.mayRelease()) {
     this.state = LifecycleStage.READY;
     this.onReady.emit();
   }
  }

  public reset() {
    if (this.mayReset()) {
      this.state = LifecycleStage.INITIALIZING;

      this.progressSubscription.unsubscribe();
      this.progressSubscription = undefined;

      this.onReset.emit();
    }
  }

  public retry() {
    throw new Error("TODO");
  }

  public repeat() {
    throw new Error("TODO");
  }

  /*
   protected done(task: T) {
   if (this.state === LifecycleStage.WORKING) && (this.transition === LifecycleTransition.NONE)) {
   this.state = LifecycleStage.FINISHED;
   this.onDone.emit();
   }
   */

  protected error(
    error: any, severity: ErrorSeverity = ErrorSeverity.SOFT
  ) {
    if (this.state === LifecycleStage.WORKING) {
      this.state = LifecycleStage.FAILED;

      const event = new TaskError(undefined, {
        activeTask: this.activeTask,
        latestStep: this.activeStep,
        latestProgress: this.latestProgress,
        error: error
      });
      switch (this.severity) {
        case ErrorSeverity.HARD:
          this.severity = ErrorSeverity.HARD;
          this.onHardError.emit(event);
          break;
        case ErrorSeverity.FATAL:
          this.severity = ErrorSeverity.FATAL;
          this.onFatalError.emit(event);
          break;
        default:
          this.severity = ErrorSeverity.SOFT;
          this.onSoftError.emit(event);
          break;
      }
    }
  }

  public isPausing(): boolean {
    return (this.state === LifecycleStage.PAUSING);
  }

  public isPaused(): boolean {
    return (this.state === LifecycleStage.PAUSED);
  }

  public isWorking(): boolean {
    return (this.state === LifecycleStage.WORKING);
  }

  public willCancel() {
    return this.state === LifecycleStage.CANCELING;
  }

  public mayCancel() {
    return this.isWorking() || this.isPausing() || this.isPaused();
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

  public hasEndOfWork() {
    return (this.hasFinished() || this.hasFailed());
  }

  get errorSeverity(): ErrorSeverity {
    return (this.hasFailed() ? this.severity : undefined);
  }

  public isReady() {
    return this.state === LifecycleStage.READY;
  }

  public mayRelease(): boolean {
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

