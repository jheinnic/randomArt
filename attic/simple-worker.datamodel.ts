/**
 * Created by jheinnic on 1/28/17.
 */
import {
  WorkerFactory, BootstrapWorker, ReadyWorker, ActiveWorkerausedWorker, CancelledWorker,
  FinishedWorker, SoftErrorWorker, HardErrorWorker, FatalErrorWorker, AbstractWorker,
  LifecycleStage, initBuilderWrapper, ErrorSeverity, WorkerModelBuilder, Worker, STATE,
  PausedWorker, ActiveWorker
} from "./abstract-worker.datamodel";
import {
  Partial, buildMethodFactory, FactoryWrapper, unwrapHelper, copyMethodFactory
} from "../../../../common/lib/datamodel-ts/index";
import {Observable} from "rxjs/Observable";
import builder = require('fluent-interface-builder');
import {P} from "../../pool/create-images-activity.datamodel";
import {Builder} from "fluent-interface-builder";
import {Subscription, Subject} from "rxjs";


export class SimpleWorkerFactory<T>
implements WorkerFactory<T>
{
  public createBootstrap(base?: Worker<T>, context?: Partial<BootstrapWorker<T>>): SimpleBootstrapWorker<T> {
    return new SimpleBootstrapWorker<T>(base, context);
  }

  public createReady(base?: Worker<T>, context?: Partial<ReadyWorker<T>>): SimpleReadyWorker<T> {
    return new SimpleReadyWorker<T>(base, context);
  }

  public createActive(base?: Worker<T>, context?: Partial<ActiveWorker<T>>): SimpleActiveWorker<T> {
    return new SimpleActiveWorker<T>(base, context);
  }

  public createPaused(base?: Worker<T>, context?: Partial<PausedWorker<T>>): SimplePausedWorker<T> {
    return new SimplePausedWorker<T>(base, context);
  }

  public createCancelled(base?: Worker<T>, context?: Partial<CancelledWorker<T>>): SimpleCancelledWorker<T>  {
    return new SimpleCancelledWorker<T>(base, context);
  }

  public createFinished(base?: Worker<T>, context?: Partial<FinishedWorker<T>>): SimpleFinishedWorker<T> {
    return new SimpleFinishedWorker<T>(base, context);
  }

  public createSoftError(base?: Worker<T>, context?: Partial<SoftErrorWorker<T>>): SimpleSoftErrorWorker<T> {
    return new SimpleSoftErrorWorker<T>(base, context);
  }

  public createHardError(base?: Worker<T>, context?: Partial<HardErrorWorker<T>>): SimpleHardErrorWorker<T> {
    return new SimpleHardErrorWorker<T>(base, context);
  }

  public createFatalError(base?: Worker<T>, context?: Partial<FatalErrorWorker<T>>): SimpleFatalErrorWorker<T> {
    return new SimpleFatalErrorWorker<T>(base, context);
  }
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
// Tagged union type for concrete Worker submodel.
//
export type SimpleWorker<T> = Worker<T> | SimpleBootstrapWorker<T> | SimpleReadyWorker<T> | SimpleActiveWorker<T> | SimplePausedWorker<T> | SimpleCancelledWorker<T>  | SimpleFinishedWorker<T> | SimpleSoftErrorWorker<T> | SimpleHardErrorWorker<T> | SimpleFatalErrorWorker<T>

// Allocate Fluent API builder factory
export const wrapSimpleWorker: Builder<WorkerFactoryWrapper<string>,Worker<string>> =
  builder.build<WorkerFactoryWrapper<string>, Worker<string>>();

// Configure above factory to yield our desired cloning solution.
initBuilderWrapper<string,WorkerModelBuilder<string>>(wrapSimpleWorker, new SimpleWorkerFactory());


export abstract class AbstractSimpleWorker<T> extends AbstractWorker<T>
{
  // State inspection shortcuts
  public readonly state: LifecycleStage;
  protected readonly onReset: Subject<void>;
  protected readonly onReady: Subject<void>;
  protected readonly onReject: Subject<T>;
  protected readonly onBegin: Subject<T>;
  protected readonly onPause: Subject<T>;
  protected readonly onResume: Subject<T>;
  protected readonly onCancel: Subject<T>;
  protected readonly onFinish: Subject<T>;
  protected readonly onRetry: Subject<T>;
  protected readonly onProgress: Subject<P>;
  protected readonly onSoftError: Subject<[T, any]>;
  protected readonly onHardError: Subject<[T, any]>;
  protected readonly onFatalError: Subject<[T, any]>;

  private readonly onAnyError: Subject<[ErrorSeverity, T, any]>;
  private readonly softSubscription: Subscription;
  private readonly hardSubscription: Subscription;
  private readonly fatalSubscription: Subscription;

  constructor(
    base?: AbstractWorker<T>, delta?: Partial<AbstractWorker<T>>,
    allocateSubjects: boolean = false
  ) {
    super(base, delta);
    // this.copy = copyMethodFactory(wrapWordPaintDataModel, this);

    // Only allocate emitters if we had neither base nor delta.
    // TODO: Instead of allowing delta, check whether these are individually undefined
    //       after the Object.assign?
    if (allocateSubjects) {
      this.onReset = new Subject<void>();
      this.onReady = new Subject<void>();
      this.onReject = new Subject<T>();
      this.onBegin = new Subject<T>();
      this.onPause = new Subject<T>();
      this.onResume = new Subject<T>();
      this.onCancel = new Subject<T>();
      this.onFinish = new Subject<T>();
      this.onRetry = new Subject<T>();
      this.onProgress = new Subject<P>();
      this.onSoftError = new Subject<[T, any]>();
      this.onHardError = new Subject<[T, any]>();
      this.onFatalError = new Subject<[T, any]>();

      this.onAnyError = new Subject<[ErrorSeverity, T, any]>();
      this.softSubscription = this.onSoftError.subscribe((next: [T, any]) => {
        this.onAnyError.next([ErrorSeverity.SOFT, next[0], next[1]]);
      });
      this.hardSubscription = this.onHardError.subscribe((next: [T, any]) => {
        this.onAnyError.next([ErrorSeverity.HARD, next[0], next[1]]);
      });
      this.fatalSubscription = this.onFatalError.subscribe((next: [T, any]) => {
        this.onAnyError.next([ErrorSeverity.FATAL, next[0], next[1]]);
      });
    }
  }
}

export class SimpleBootstrapWorker<T> extends AbstractSimpleWorker<T> implements BootstrapWorker<T>
{
  readonly state: LifecycleStage & "BOOTSTRAP" = "BOOTSTRAP";

  constructor(base?: SimpleWorker<T>, delta?: Partial<SimpleBootstrapWorker<T>>, allocEvents?: boolean) {
    super(undefined, undefined, true);
    Object.assign(this, base, delta);
  }

  public reset(): void {
    this.onReset.next();
  }

  public isFullyConfigured(): boolean {
    return true;
  }

  public beforeReady(): boolean {
     return this.isFullyConfigured();
  }


}

export class SimpleReadyWorker<T> extends AbstractSimpleWorker<T> implements ReadyWorker<T>
{
  readonly state: LifecycleStage & "READY" = "READY";

  constructor(base?: SimpleWorker<T>, delta?: Partial<SimpleReadyWorker<T>>) {
    super();
    Object.assign(this, base, delta);
  }

  public ready(): void {
    this.onReady.next();
  }

  public beforeBegin(): boolean {
    return this.isReady();
  }
}

export class SimpleActiveWorker<T> extends AbstractSimpleWorker<T> implements ActiveWorker<T>
{
  readonly state: LifecycleStage & "ACTIVE" = "ACTIVE";
  readonly currentTask: T;

  constructor(base?: SimpleWorker<T>, delta?: Partial<SimpleActiveWorker<T>>) {
    super();
    Object.assign(this, base, delta);
  }

  public begin(task: T): void {
    if (this.currentTask !== task) {
      throw new Error("Task provided to begin() does not match cached next target");
    }
    this.onBegin.next(task);
  }

  public beforePause(): boolean {
    return this.isWorking();
  }

  public resume(): void {
    this.onResume.next();
  }

  public retry(): void {
    this.onRetry.next(this.currentTask);
  }

  public beforeCancel(): boolean {
    return this.mayCancel();
  }

  public beforeFinish(): boolean {
    return this.isWorking();
  }

  public beforeError(severity: ErrorSeverity, err: any): void {
    console.error("Error " + err + " of severity " + severity);
  }
}


export class SimplePausedWorker<T> extends AbstractSimpleWorker<T> implements PausedWorker<T>
{
  readonly state: LifecycleStage & "PAUSED" = "PAUSED";
  readonly currentTask: T;

  constructor(base?: SimpleWorker<T>, delta?: Partial<SimplePausedWorker<T>>) {
    super();
    Object.assign(this, base, delta);
  }

  public pause(): void {
    this.onPause.next();
  }

  public beforeResume(): boolean {
    return this.isPaused();
  }

  public beforeCancel(): boolean {
    return this.mayCancel();
  }

  public beforeError(severity: ErrorSeverity, err: any): void {
    console.error("Error " + err + " of severity " + severity);
  }
}

export class SimpleCancelledWorker<T> extends AbstractSimpleWorker<T> implements CancelledWorker<T>
{
  readonly state: LifecycleStage & "CANCELLED" = "CANCELLED";
  readonly currentTask: T;

  constructor(base?: SimpleWorker<T>, delta?: Partial<SimpleCancelledWorker<T>>) {
    super();
    Object.assign(this, base, delta);
  }

  public cancel(): void {
    this.onCancel.next();
  }

  public acknowledge(task: T): boolean {
    return this.mayAcknowledge();
  }

  public beforeRetry(): boolean {
    return this.mayRetry();
  }

  public beforeReset(): boolean {
    return this.mayReset();
  }
}

export class SimpleFinishedWorker<T> extends AbstractSimpleWorker<T> implements FinishedWorker<T>
{
  readonly state: LifecycleStage & "FINISHED" = "FINISHED";
  readonly currentTask: T;
  readonly result: any;

  constructor(base?: SimpleWorker<T>, delta?: Partial<SimpleFinishedWorker<T>>) {
    super();
    Object.assign(this, base, delta);
  }

  public finish(): void {
    this.onFinish.next(this.currentTask);
  }

  public acknowledge(task: T): boolean {
    return this.mayAcknowledge() && (this.currentTask === task);
  }

  public beforeReset(): boolean {
    return this.mayReset();
  }
}

export class SimpleSoftErrorWorker<T> extends AbstractSimpleWorker<T> implements SoftErrorWorker<T>
{
  readonly state: LifecycleStage & "MAY_RETRY" = "MAY_RETRY";
  readonly currentTask: T;
  readonly err: any;

  constructor(base?: SimpleWorker<T>, delta?: Partial<SimpleSoftErrorWorker<T>>) {
    super();
    Object.assign(this, base, delta);
  }

  public softError(err: any) {
    this.onSoftError.next([this.currentTask, err]);
  }

  public acknowledge(task: T): boolean {
    return this.mayAcknowledge() && (this.currentTask === task);
  }

  public beforeRetry(): boolean {
    return this.mayRetry();
  }

  public beforeReset(): boolean {
    return this.mayReset();
  }
}

export class SimpleHardErrorWorker<T> extends AbstractSimpleWorker<T> implements HardErrorWorker<T>
{
  readonly state: LifecycleStage & "FAILED" = "FAILED";
  readonly currentTask: T;
  readonly err: any;

  constructor(base?: SimpleWorker<T>, delta?: Partial<SimpleHardErrorWorker<T>>) {
    super();
    Object.assign(this, base, delta);
  }

  public hardError(err: any) {
    this.onHardError.next([this.currentTask, err]);
  }

  public acknowledge(task: T): boolean {
    return this.mayAcknowledge() && (this.currentTask === task);
  }

  public beforeReset(): boolean {
    return this.mayReset();
  }
}

export class SimpleFatalErrorWorker<T> extends AbstractSimpleWorker<T> implements FatalErrorWorker<T>
{
  readonly state: LifecycleStage & "EXCEPTION" = "EXCEPTION";
  readonly currentTask: T;
  readonly err: any;

  constructor(base?: SimpleWorker<T>, delta?: Partial<SimpleFatalErrorWorker<T>>) {
    super();
    Object.assign(this, base, delta);
  }

  public fatalError(err: any) {
    this.onFatalError.next([this.currentTask, err]);
  }

  public beforeReset(): boolean {
    return this.mayReset();
  }
}

/*
const factory: SimpleWorkerFactory<String> =
  new SimpleWorkerFactory<String>();

export const wrapWorker =
  builder.build<WorkerFactoryWrapper<String>, Worker<String>>()
    .chain('configure', (ackSource: Observable<String>) => (context: Worker<String>) => {
      let retVal: BootstrapWorker<String>;
      switch (context.state) {
        case STATE.BOOTSTRAP:
          if (context.ackSource) {
            throw new Error("Acknowledgments source already bootstrapped");
          }              import builder = require('fluent-interface-builder');
          retVal = factory.createBootstrap(context, {ackSource: ackSource});
          break;
        default:
          throw new Error("Invalid state: " + context.state);
      }
      return retVal;
    })
    .chain('ready', () => (context: Worker<String>) => {
      let retVal: ReadyWorker<String>;
      switch (context.state) {
        case STATE.BOOTSTRAP:
          if (context.isFullyConfigured()) {
            retVal = factory.createReady(context, {state: STATE.READY});
          } else {
            throw new Error("Cannot complete initialization with incomplete configuration.");
          }
          break;
        default:
          throw new Error("Invalid state: " + context.state);
      }
      return retVal;
    })
    .chain('begin', (task: String) => (context: Worker<String>) => {
      let retVal: ActiveWorker<String>;
      switch (context.state) {
        case STATE.READY:
          if (context.beforeBegin()) {
            retVal = factory.createActive(context, {
              state: STATE.ACTIVE,
              currentTask: task
            });
            retVal.begin(task);
          } else {
            throw new Error("Task was rejected: " + task);
          }
          break;
        default:
          throw new Error("Invalid state: " + context.state);
      }
      return retVal;
    })
    .chain('pause', () => (context: Worker<String>) => {
      let retVal: PausedWorker<String>;
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
    .chain('resume', () => (context: Worker<String>) => {
      let retVal: ActiveWorker<String>;
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
    .chain('cancel', () => (context: Worker<String>) => {
      let retVal: CancelledWorker<String>;
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
    .chain('finish', () => (context: Worker<String>) => {
      let retVal: FinishedWorker<String>;
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
    .chain('retry', () => (context: Worker<String>) => {
      let retVal: ActiveWorker<String>;

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
    .chain('acknowledge', (task: String) => (context: Worker<String>) => {
      let retVal: ReadyWorker<String>;
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

    /*
    .chain('softError', (err: any) => (context: Worker<String>) => {
      let retVal: SoftErrorWorker<String>;
      switch (context.state) {
        case STATE.PAUSED:
        case STATE.ACTIVE:
          context.beforeError(ErrorSeverity.SOFT, err);
          retVal = factory.createSoftError(this.context, {state: STATE.MAY_RETRY, err: err});
          retVal.softError(err);
          break;
        default:
          throw new Error("Invalid state: " + context.state);
      }
      return retVal;
    })
    .chain('hardError', (err:any) => (context: Worker<String>) => {
      let retVal: HardErrorWorker<String>;
      switch (context.state) {
        case STATE.PAUSED:
        case STATE.ACTIVE:
          context.beforeError(ErrorSeverity.HARD, err);
          retVal = factory.createHardError(this.context, {state: STATE.FAILED, err: err});
          retVal.hardError(err);
          break;
        default:
          throw new Error("Invalid state: " + context.state);
      }
      return retVal;
    })
    .chain('fatalError', (err:any) => (context: Worker<String>) => {
      let retVal: FatalErrorWorker<String>;
      switch (context.state) {
        case STATE.PAUSED:
        case STATE.ACTIVE:
          context.beforeError(ErrorSeverity.FATAL, err);
          retVal = factory.createFatalError(this.context, {state: STATE.EXCEPTION, err: err});
          retVal.fatalError(err);
          break;
        default:
          throw new Error("Invalid state: " + context.state);
      }
      return retVal;
    })
    .unwrap('unwrap', unwrapHelper);
    */
