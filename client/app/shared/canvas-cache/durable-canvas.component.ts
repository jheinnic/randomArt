import {Component, ViewChild, Output, EventEmitter, ElementRef} from "@angular/core";
import path = require('path');

/**
 * Created by jheinnic on 1/5/17.
 */

@Component({
  moduleId: path.resolve(__dirname, __filename),
  selector: 'durable-canvas',
  template: require('./_durable-canvas.view.html')
})
export class DurableCanvasComponent {
  @ViewChild("cachedCanvas") private cachedCanvas: ElementRef;
  @Output() private readonly onWidthChanged = new EventEmitter<number>();
  @Output() private readonly onHeightChanged = new EventEmitter<number>();

  constructor() { }

  public get mediaStream(): MediaStream {
    return this.cachedCanvas.nativeElement.captureMediaStream();
  }

  public get context2D(): CanvasRenderingContext2D {
    return this.cachedCanvas.nativeElement.getContext('2d');
  }

  get width() {
    return this.cachedCanvas.nativeElement.width();
  };

  set width(value: number) {
    this.cachedCanvas.nativeElement.width(value);
    this.onWidthChanged.emit(value);
  };

  get height() {
    return this.cachedCanvas.nativeElement.height();
  };

  set height(value: number) {
    this.cachedCanvas.nativeElement.height(value);
    this.onHeightChanged.emit(value);
  };
}
