/**
 * Created by jheinnic on 1/5/17.
 */
import {ComponentRef} from "@angular/core";
import {DomPortalHost} from "@angular/material";
import {Observable, Subject} from "rxjs";
import {DurableCanvasComponent} from "./durable-canvas.component";

export class DurableCanvasRef
{
  // private readonly canvasContext2D: CanvasRenderingContext2D;
  // private readonly mediaStream: MediaStream;

  //TODO: Implement this better
  public _afterRelease = new Subject<void>();

  // TODO: Instead of DomPortalHost, should the container back-reference be to the
  // ComponentPortal object?  Isn't ComponentPortal responsible for instantiating this
  // class?  Doesn't that mean that it has some constructor signature we're expected to
  // obey?  If that's all true, we may want to keep the DurableCanvasPortal class afterall,
  // if only because we need it to override the currnet defaults.
  constructor(
    public readonly id: string,
    private readonly durableCanvasRef: ComponentRef<DurableCanvasComponent>,
    private readonly portalHost: DomPortalHost
  ) {
    this.durableCanvasRef.onDestroy(() => {
      if (! this._afterRelease.closed) {
        this._afterRelease.next();
        this._afterRelease.complete();
      }
    })
  }

  /** Gets an observable that is notified when the snack bar is finished closing. */
  afterReleased():Observable<void> {
    return this._afterRelease.asObservable();
  }

  get mediaStream(): MediaStream {
    let retVal = null;
    if (! this._afterRelease.closed) {
      retVal = this.durableCanvasRef.instance.mediaStream;
    }
    return retVal;
  }

  get context2D(): CanvasRenderingContext2D {
    let retVal: CanvasRenderingContext2D = null;
    if (! this._afterRelease.closed) {
      retVal = this.durableCanvasRef.instance.context2D;
    }
    return retVal;
  }

  public release(): void {
    this.durableCanvasRef.destroy();
  }

  get width() {
    return this.durableCanvasRef.instance.width;
  };

  set width(value: number) {
    this.durableCanvasRef.instance.width = value;
  };

  get height() {
    return this.durableCanvasRef.instance.height;
  };

  set height(value: number) {
    this.durableCanvasRef.instance.height = value;
  };
}
