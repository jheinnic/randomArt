/**
 * Created by jheinnic on 1/11/17.
 */
import {
  Directive, ElementRef, Attribute, EventEmitter, Output, Input, OnDestroy, HostBinding,
  ContentChild, AfterViewInit
} from "@angular/core";
import {PaintProgress} from "../../pool/point-mapping.service";
import {Subscription} from "rxjs/Subscription";
import {AsyncSubject} from "rxjs/AsyncSubject";
import {Observable} from "rxjs/Observable";
import {PaintablePoint} from "./point.datamodel";
import {Partial} from "../../../../common/lib/datamodel-ts/index";

export interface Dimensions
{
  readonly pixelWidth?: number;
  readonly pixelHeight?: number;
}

@Directive({
  selector: "canvas[paintable]",
})
export class PaintableDirective implements AfterViewInit, OnDestroy
{
  @ContentChild("canvas[paintable]") domRef: ElementRef;
  private canvasRef: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private mySize: Dimensions;
  private myBlob: AsyncSubject<Blob>;

  public readonly originalSize: Dimensions;

  @Output() public resized = new EventEmitter<Dimensions>();

  private progressSubscript: Subscription;
  private progressSource: Observable<PaintProgress>;


  constructor(
    // private readonly canvasRef: ElementRef,
    @Attribute("width") width: number,
    @Attribute("height") height: number,
    // @Attribute("maxBufferSize") maxBufferSize: number,
    // @Attribute("liveLatencyDuration") liveLatencuDuration: number
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
    // this.canvas = canvasRef.nativeElement;
    // console.log("Constructor: ", this.canvasRef);
  }

  public ngAfterViewInit() {
    this.canvasRef = this.domRef.nativeElement;
  }

  public ngOnDestroy() {
    this.progressSubscript.unsubscribe();
  }

  @HostBinding("width")
  public get width() {
    return this.mySize.pixelWidth;
  }

  public set width(value: number) {
    this.mySize = Object.assign({}, this.mySize, {pixelWidth: value});
  }

  @HostBinding("height")
  public get height() {
    return this.mySize.pixelHeight;
  }

  public set height(value: number) {
    this.mySize = Object.assign({}, this.mySize, {pixelHeight: value});
  }

  @Input("sizeable")
  public set sizable(value: Partial<Dimensions>) {
    const nextSize = Object.assign({}, this.mySize || {}, value || {});

    if ((nextSize.pixelWidth !== this.width) || (nextSize.pixelHeight !== this.height)) {
      this.mySize = nextSize;

      if (this.domRef && this.canvasRef) {
        this.context = this.canvasRef.getContext("2d");
        this.resized.emit(this.mySize);
      }

      this.myBlob = undefined;
    }
  }

  @Input("paintable")
  public set paintable(progressSource: Observable<PaintProgress>) {
    if (progressSource) {
      const self: PaintableDirective = this;

      this.progressSource = progressSource;
      this.progressSubscript = progressSource.subscribe(function (progress: PaintProgress) {
        if ((!progress) || (!progress.paintPoints) || (progress.paintPoints.length > 0)) {
          console.log(`Canvas asked to paint ${progress.paintPoints.length}, starting with "${progress.paintPoints[0]}"`);
          self.paint(progress.paintPoints);
        }
      }, function (error: any) { console.error(error); }, function () { this.progressSubscript = undefined; });
    }
  }

  public paint(points: PaintablePoint[]): void {
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

  public get blob(): Observable<Blob> {
    let retVal: AsyncSubject<Blob>;
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
}
