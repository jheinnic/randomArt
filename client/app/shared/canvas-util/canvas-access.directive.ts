/**
 * Created by jheinnic on 1/11/17.
 */
import {
  Directive, ContentChild, AfterContentInit, ElementRef, Attribute, EventEmitter, Output
} from "@angular/core";
import {DynamicCanvasRenderingContext2D} from "./dynamic-canvas-rendering-context-2d.class";
import {AsyncSubject} from "rxjs/AsyncSubject";
import {Observable} from "rxjs/Observable";

export interface Dimensions {
  readonly width?: number;
  readonly height?: number;
}

@Directive({
  selector: 'canvas[access]',
  inputs: [
    '_size:size'
  ],
  host: {
    'width.px': '_size.width',
    'height.px': '_size.height'
  },
  exportAs: 'access'
})
export class CanvasAccessDirective implements AfterContentInit
{
  private canvas: HTMLCanvasElement;
  private _context: DynamicCanvasRenderingContext2D;
  private _size: Dimensions;

  private _blob: AsyncSubject<Blob>;

  public readonly originalSize: Dimensions;

  @Output() public resized = new EventEmitter<Dimensions>();

  @ContentChild("canvas[access]") private element: ElementRef;

  constructor(@Attribute('width') width:number, @Attribute('height') height:number) {
    this.originalSize = { width: width, height: height };
    this._size = Object.assign({}, this.originalSize);
  }

  public get width() {
    return this._size.width;
  }

  public set width(value: number) {
    this.size = {width: value};
  }

  public get height() {
    return this._size.height;
  }

  public set height(value: number) {
    this.size = {height: value};
  }

  public get size(): Dimensions {
    return Object.assign({}, this._size);
  }

  public set size(value:Dimensions) {
    const nextSize = Object.assign({}, this._size, value);

    if ((nextSize.width !== this.width) || (nextSize.height !== this.height)) {
      this._size = nextSize;

      if (this._context) {
        this._context.ctx = this.canvas.getContext('2d');
        this.resized.emit(this.size);
      }

      this._blob = undefined;
    }
  }

  public ngAfterContentInit() {
    this.canvas = this.element.nativeElement;
    this._context = new DynamicCanvasRenderingContext2D(
      this.canvas.getContext("2d")
    );
  }

  public get context(): CanvasRenderingContext2D {
    return this._context;
  }

  public get blob(): Observable<Blob> {
    let retVal: AsyncSubject<Blob>;
    if (this._blob) {
      retVal = this._blob;
    } else {
      this._blob = new AsyncSubject<Blob>();
      retVal = this._blob;

      this.canvas.toBlob(function (blob) {
        retVal.next(blob);
        retVal.complete();
      }, "image/png");
    }

    return retVal.asObservable();
  }

  public flushBlob() {
    this._blob = undefined;
  }
}
