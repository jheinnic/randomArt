/**
 * Created by jheinnic on 2/2/17.
 */
import {BehaviorSubject, Observable} from "rxjs";
import {KeyToValue} from "../../../../common/lib/datamodel-ts";

export type ServiceLifecycleStage = 'offline' | 'available' | 'busy' | 'zombie' | 'stopped' | 'failed';
export type ServiceEventKind = 'new' | 'launched' | 'reserved' | 'released' | 'closed' | 'shutDown' | 'crashed' | 'reset';

export const ServiceStage: KeyToValue<ServiceLifecycleStage> = {
  offline: 'offline',
  available: 'available',
  busy: 'busy',
  zombie: 'zombie',
  stopped: 'stopped',
  failed: 'failed'
};

export interface NewServiceEvent
{
  kind: ServiceEventKind & 'new';
}

export interface LaunchedServiceEvent
{
  kind: ServiceEventKind & 'launched';
}

export interface ReservedServiceEvent
{
  kind: ServiceEventKind & 'reserved';
}

export interface ReleasedServiceEvent
{
  kind: ServiceEventKind & 'released';
}

export interface ClosedServiceEvent
{
  kind: ServiceEventKind & 'closed';
}

export interface ShutDownServiceEvent
{
  kind: ServiceEventKind & 'shutDown';
}

export interface CrashedServiceEvent
{
  kind: ServiceEventKind & 'crashed';
}

export interface ResetServiceEvent
{
  kind: ServiceEventKind & 'reset';
}

export type ServiceEventType = NewServiceEvent | LaunchedServiceEvent | ReservedServiceEvent | ReleasedServiceEvent | ClosedServiceEvent | ShutDownServiceEvent | CrashedServiceEvent | ResetServiceEvent;


/**
 * Abstract base class for a worker with a lifecycle, with a set of base properties that
 * is the union of all event interface types.  This facilitates a pattern where changes in
 * lifecycle's state machine are coincident to immutable reconstruction.  This in turn
 * promotes use of the service worker's lifecycle state engine object itself as the lifecycle
 * event payload.
 */
export class AbstractService
{
  private svcStage: ServiceLifecycleStage = 'offline';
  private readonly myEvents: BehaviorSubject<ServiceEventType>;
  private error:any;

  constructor() {
    this.myEvents = new BehaviorSubject<ServiceEventType>({kind: 'new'});
  }

  protected getStage(): ServiceLifecycleStage {
    return this.svcStage;
  }

  protected getEvents(): Observable<ServiceEventType> {
    return this.myEvents.asObservable();
  }

  private assertTransition(from: ServiceLifecycleStage, to: ServiceLifecycleStage) {
    if (this.svcStage !== from) {
      throw new Error(`Cannot transition from ${from} while current state is ${this.svcStage}`);
    }

    let nextEvent;
    switch(`${from}->${to}`) {
      case 'offline->available':
        nextEvent = { kind: 'launched' };
        break;
      case 'available->zombie':
      case 'busy->zombie':
        nextEvent = { kind: 'closed' };
        break;
      case 'available->busy':
        nextEvent = { kind: 'reserved' };
        break;
      case 'busy->available':
        nextEvent = { kind: 'released' };
        break;
      case 'zombie->stopped':
        nextEvent = { kind: 'shutDown' };
        break;
      case 'available->failed':
      case 'busy->failed':
      case 'zombie->failed':
        nextEvent = { kind: 'crashed', error: this.error };
        break;
      case 'stopped->offline':
      case 'failed->offline':
        nextEvent = { kind: 'reset' };
        break;
      default:
        throw new Error(
          `Cannot transition to ${to} while current state is ${this.svcStage}`);
    }

    setTimeout(() => {
      this.svcStage = to;
      this.myEvents.next(nextEvent);
    });
  }
  protected launch() {
    this.assertTransition('offline', 'available');
  }

  protected close() {
    if (this.svcStage === 'busy') {
      this.assertTransition('busy', 'zombie');
    } else {
      this.assertTransition('available', 'zombie');
    }
  }

  protected reserve() {
    this.assertTransition('available', 'busy');
  }

  protected release() {
    this.assertTransition('busy', 'available');
  }

  protected stop() {
    this.assertTransition('zombie', 'stopped');
  }

  protected assert(error:any) {
    this.error = error;
    this.assertTransition(this.svcStage, 'failed');
    this.error = undefined;
  }

  protected reset() {
    this.assertTransition(this.svcStage, 'offline');
  }
}
