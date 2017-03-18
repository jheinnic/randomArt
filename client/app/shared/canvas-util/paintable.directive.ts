/**
 * Created by jheinnic on 1/11/17.
 */
import {
  Directive, ElementRef, Attribute, EventEmitter, Output, OnDestroy, HostBinding, ContentChild,
  AfterViewInit
} from "@angular/core";
import {Subscription} from "rxjs/Subscription";
import {AsyncSubject} from "rxjs/AsyncSubject";
import {Observable} from "rxjs/Observable";
import {PaintablePoint} from "./point.datamodel";
import {TaskEvent} from "../service-util/task-lifecycle.datamodel";
import {WordPaintProgress} from "../../pool/word-paint-progress.datamodel";
import {WordPaintTask} from "../../pool/word-paint-task.class";
import {WordPaintResult} from "../../pool/word-paint-result.datamodel";
import {WordPaintInput} from "../../pool/word-paint-input.datamodel";

export interface Dimensions
{
  readonly pixelWidth?: number;
  readonly pixelHeight?: number;
}

@Directive({
  selector: "canvas[paintable]"
})
export class PaintableDirective implements OnDestroy
{
  private readonly canvasRef: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private mySize: Dimensions;
  private myBlob: AsyncSubject<Blob>;

  public readonly originalSize: Dimensions;

  @Output() public resized = new EventEmitter<Dimensions>();

  private progressSubscript: Subscription;
  // private progressSource: Observable<WordPaintProgress>;
  private paintableTask: WordPaintTask;


  constructor(
    @Attribute("width") width: number,
    @Attribute("height") height: number,
    private readonly domRef: ElementRef
  ) {
    this.originalSize = {
      pixelWidth: width,
      pixelHeight: height
    };
    this.mySize = this.originalSize;
    // this.mySize = {
    //   pixelWidth: 480,
    //   pixelHeight: 480
    // };

    console.log("Paintable self: ", this.domRef);
    this.canvasRef = this.domRef.nativeElement;
    // this.canvas = canvasRef.nativeElement;
    // console.log("Constructor: ", this.canvasRef);
  }

  public ngOnDestroy() {
    this.progressSubscript.unsubscribe();
  }

  @HostBinding("width")
  public get width() {
    return this.mySize.pixelWidth;
  }

  // public set width(value: number) {
  //   this.mySize = Object.assign({}, this.mySize, {pixelWidth: value});
  // }

  @HostBinding("height")
  public get height() {
    return this.mySize.pixelHeight;
  }

  // public set height(value: number) {
  //   this.mySize = Object.assign({}, this.mySize, {pixelHeight: value});
  // }

  /*
   @Input("sizable")
   public set sizable(value: string) {
   const nextSize;
   if (value) {
   let tokens = value.split('x');
   if (tokens.length === 2) {
   nextSize = Object.assign(), this.mySize || {}. value || {
   pixelWidth: pixelWidth,
   pixelHeight, pixelHeight
   }
   }
   if ((nextSize.pixelWidth !== this.width) || (nextSize.pixelHeight !== this.height)) {
   this.mySize = nextSize;

   if (this.domRef && this.canvasRef) {
   this.context = this.canvasRef.getContext("2d");
   this.resized.emit(this.mySize);
   }

   this.myBlob = undefined;
   }
   }
   }

   public get sizable(): Partial<Dimensions> {
   return this.mySize;
   }
   */

  // @Input("sizable")
  // public set sizable(value: Partial<Dimensions>) {
  //   const nextSize = Object.assign({}, this.mySize || {}, value || {});
  //
  //   if ((nextSize.pixelWidth !== this.width) || (nextSize.pixelHeight !== this.height)) {
  //     this.mySize = nextSize;
  //
  //     if (this.domRef && this.canvasRef) {
  //       this.context = this.canvasRef.getContext("2d");
  //       this.resized.emit(this.mySize);
  //     }
  //
  //     this.myBlob = undefined;
  //   }
  // }
  //
  // public get sizable(): Partial<Dimensions> {
  //   return this.mySize;
  // }

  // @Input("paintable")
  // public set paintable(paintableTask: WordPaintTask) {
  public subscribeTo(
    paintTaskEvents: Observable<TaskEvent<WordPaintInput,WordPaintProgress,WordPaintResult>>
  ) {
    if (this.progressSubscript) {
      this.progressSubscript.unsubscribe();
    }

    if (paintTaskEvents) {
      this.progressSubscript = paintTaskEvents.subscribe(function (event: TaskEvent<WordPaintInput,WordPaintProgress,WordPaintResult>) {
        if (event.kind === 'began') {
          this.mySize = {
            pixelWidth: event.task.chain.pixelWidth,
            pixelHeight: event.task.chain.pixelHeight,
          };
          this.clearView();
        } else if (event.kind === 'progress') {
          this.paint(event.progress.paintPoints);
        } else if (event.kind === 'acknowledged') {
          this.clearView();
          if (this.progressSubscript) {
            this.progressSubscript.unsubscribe();
          } else {
            console.log('Event subscription had lapsed before previous shutdown.  Oh well..');
          }
        } else {
          console.log('Unexpected paintable task event, ' + JSON.stringify(this.event)
            + ', while in state.');
        }
      }, function (error: any) { console.error(error); }, function () { this.progressSubscript = undefined; });
    }
  }

// public get paintable(): Observable<PaintProgress> {
//   return this.progressSource;
// }

  public paint(
    points: PaintablePoint[]
  ): void {
    if (points) {
      points.forEach((point: PaintablePoint) => {
        if ((point.x < 0) || (point.x >= this.width)) {
          throw new Error(`Point ${PaintablePoint.asString(point)} is out of bounds for ${this.width} x ${this.height}.`);
        }
        if ((point.y < 0) || (point.y >= this.height)) {
          throw new Error(`Point ${PaintablePoint.asString(point)} is out of bounds for ${this.width} x ${this.height}.`);
        }
        point.paintTo(this.context);
      });
    }
  }

  public get dataUrl(): string {
    let retVal: string;
    if (this.canvasRef) {
      retVal = this.canvasRef.toDataURL("image/png");
    }
    return retVal;
  }

  public get blob(): Observable < Blob > {
    let retVal: AsyncSubject < Blob >;
    if (this.myBlob) {
      retVal = this.myBlob;
    } else {
      this.myBlob = new AsyncSubject<Blob>();
      retVal = this.myBlob;

      this.canvasRef.toBlob(function (blob) {
        retVal.next(blob);
        retVal.complete();
      }, "image/png");
    }

    return retVal.asObservable();
  }

  public flushBlob() {
    this.myBlob = undefined;
  }

  private clearView() {
    this.flushBlob();
    // TODO: More to cleanup still!!!
  }
}
