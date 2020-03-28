/**
 * Created by jheinnic on 1/2/17.
 */
import {Directive, Output} from "@angular/core";
import {EventEmitter} from "@angular/common/src/facade/async";
import uuid = require('uuid');
import _ = require('lodash');

enum LifecycleStage {
  INITIALIZING, READY, LAUNCHING, WORKING, PAUSING, PAUSED, RESUMING, CANCELLING, FINISHED
}

enum LifecycleTransition {
    NONE, INITIALIZING, LAUNCHING, PAUSING, RESUMING, CANCELLING
};


@Directive({
  selector: "canvas[lifecycle]",
  exportAs: 'lifecycle'
})
export class V1ProjectLifecycleDirective
{
  @Output() private beLaunchingEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() private bePausingEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() private beResumingEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() private beCancelingEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() private beResetEvent: EventEmitter<void> = new EventEmitter<void>();

  private state: LifecycleStage = LifecycleStage.INITIALIZING;
  private transition: LifecycleTransition = LifecycleTransition.INITIALIZING;

  constructor() {
  }

  // Stable States
  // The host triggers these and this directive records the observation.
  public ready() {
    if (this.state === LifecycleStage.INITIALIZING) {
      this.state = LifecycleStage.READY;
    }
  };

  public begin() {
    if (this.state === LifecycleStage.LAUNCHING) {
      this.state = LifecycleStage.WORKING;
    }
  }

  // The one case where we change stable states without an iintermediate stage.
  public finish() {
    if (this.state === LifecycleStage.WORKING) {
      this.state = LifecycleStage.FINISHED;
    }
  }

  // Transition States
  // (These trigger events the host is expected to respond to and then acknowledge)

  public launch() {
    if (this.state === LifecycleStage.READY) {
      this.state = LifecycleStage.LAUNCHING;
      this.transition = LifecycleTransition.NONE;
      this.beLaunchingEvent.emit();
    }
  };

  public pause() {
    if (this.state === LifecycleStage.WORKING) {
      this.state = LifecycleStage.PAUSING;
      this.transition = LifecycleTransition.PAUSING;
      this.bePausingEvent.emit();
    }
  }

  public resume() {
    if (this.state === LifecycleStage.PAUSED) {
      this.state = LifecycleStage.RESUMING;
      this.transition = LifecycleTransition.RESUMING;
      this.beResumingEvent.emit();
    }
  }

  public cancel() {
    if ((this.state === LifecycleStage.WORKING) || (this.state === LifecycleStage.PAUSING)
      || (this.state === LifecycleStage.PAUSED) || (this.state === LifecycleStage.RESUMING)) {
      this.state = LifecycleStage.CANCELLING;
      this.transition = LifecycleTransition.CANCELLING;
      this.beCancelingEvent.emit();
    }
  }

  public reset() {
    if (this.state === LifecycleStage.FINISHED) {
      this.state = LifecycleStage.INITIALIZING;
      this.transition = LifecycleTransition.INITIALIZING;
      this.beResetEvent.emit();
    }
  }

  checkForTransition() {
    const retVal = this.transition;
    if (this.transition !== LifecycleTransition.NONE) {
      switch (this.transition) {
        case LifecycleTransition.PAUSING: {
          this.state = LifecycleStage.PAUSED;
          break;
        }
        case LifecycleTransition.CANCELLING: {
          this.state = LifecycleStage.READY;
          break;
        }
        case LifecycleTransition.INITIALIZING: {
          this.state = LifecycleStage.READY;
          break;
        }
        case LifecycleTransition.LAUNCHING: {
          this.state = LifecycleStage.WORKING;
          break;
        }
        case LifecycleTransition.RESUMING: {
          this.state = LifecycleStage.WORKING;
          break;
        }
        default: {
          break;
        }
      }

      this.transition = LifecycleTransition.NONE;
    }

    return retVal;
  }

}
