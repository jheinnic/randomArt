import {Component, ViewChild, Output, EventEmitter, ElementRef} from "@angular/core";
import path = require('path');

/**
 * Created by jheinnic on 1/5/17.
 */

@Component({
  moduleId: path.resolve(__dirname, __filename),
  selector: 'durable-canvas',
  template: require('./_durable-canvas-container.view.html')
})
export class DurableCanvasContainerComponent {
  @ViewChild("cacheHeldCanvas") private cacheHeldCanvas: ElementRef;
  @Output() private readonly onWidthChanged = new EventEmitter<number>();
  @Output() private readonly onHeightChanged = new EventEmitter<number>();

  constructor() { }

  public get mediaStream(): MediaStream {
    return this.cacheHeldCanvas.nativeElement.captureMediaStream();
  }

  public get context2D(): CanvasRenderingContext2D {
    return this.cacheHeldCanvas.nativeElement.getContext('2d');
  }

  get width() {
    return this.cacheHeldCanvas.nativeElement.width();
  };

  set width(value: number) {
    this.cacheHeldCanvas.nativeElement.width(value);
    this.onWidthChanged.emit(value);
  };

  get height() {
    return this.cacheHeldCanvas.nativeElement.height();
  };

  set height(value: number) {
    this.cacheHeldCanvas.nativeElement.height(value);
    this.onHeightChanged.emit(value);
  };
}
