/**
 * Created by jheinnic on 1/11/17.
 */
import {
  Directive, ContentChild, AfterContentInit, ElementRef, NgZone, Input, Attribute, EventEmitter
} from "@angular/core";
import {DynamicCanvasRenderingContext2D} from "./dynamic-canvas-rendering-context-2d.class";

export interface Dimensions {
  width?: number;
  height?: number;
}

@Directive({
  selector: 'canvas[dimensions]',
  inputs: [
    'width:width',
    'height:height'
  ],
  host: {
    'width.px': 'size.width',
    'height.px': 'size.height'
  },
  exportAs: 'access'
})
export class CanvasAccessDirective implements AfterContentInit
{
  public canvas: HTMLCanvasElement;
  public ctx: DynamicCanvasRenderingContext2D;
  public size = { width: 640, height: 480 };
  public originalSize: Dimensions;

  public resized = new EventEmitter<Dimensions>();

  @ContentChild("canvas") private element: ElementRef;

  constructor(@Attribute('width') width:number, @Attribute('height') height:number) {
    this.originalSize = { width: width, height: height };
  }

  public ngAfterContentInit() {
    this.canvas = this.element.nativeElement;
    this.ctx = new DynamicCanvasRenderingContext2D(
      this.canvas.getContext("2d")
    );
  }

  public get width() {
    return this.size.width;
  }

  public set width(value: number) {
    this.size.width = value;
    this.ctx.ctx = this.canvas.getContext('2d');
    this.resized.emit(this.size);
  }

  public get height() {
    return this.size.height;
  }

  public set height(value: number) {
    this.size.height = value;
    this.ctx.ctx = this.canvas.getContext('2d');
    this.resized.emit(this.size);
  }

  public get context(): CanvasRenderingContext2D {
    return this.ctx;
  }

  @Input() public get dimensions():Dimensions {
    return Object.assign({}, this.size);
  }

  public set dimensions(value:Dimensions) {
    this.size = Object.assign(this.size, value);
    this.ctx.ctx = this.canvas.getContext('2d');
    this.resized.emit(this.size);
  }
}
