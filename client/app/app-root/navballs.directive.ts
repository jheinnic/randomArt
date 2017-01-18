/**
 * Created by jheinnic on 1/11/17.
 */
import {Directive, ContentChild, AfterContentInit, ElementRef, NgZone} from "@angular/core";

interface Color
{
  r: number;
  g: number;
  b: number;
}
;

interface Point
{
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
}
;

@Directive({
  selector: 'canvas[navballs]',
  host: {
    'dimensions': '{width: 1920, height:64}',
    'class.fixed-top': 'true',
    'class.md-elevation-z1': 'true',
    'id': '"navballs"'
  }
})
export class NavBallsDirective implements AfterContentInit
{
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected width: number;
  protected height: number;

  @ContentChild('navballs') element: ElementRef;

  private threshold: number;
  private colors: Color;
  private cycle: number;
  private points: Point[];

  constructor(private readonly ngZone: NgZone) {
    this.width = 1920;
    this.height = 64;
  }

  public ngAfterContentInit() {
    this.canvas = this.element.nativeElement;
    this.ctx = this.canvas.getContext("2d"), // let tempCanvas = document.createElement("canvas"),
      // let tempCtx = tempCanvas.getContext("2d"),
      this.threshold = 210, this.colors = {
      r: 255,
      g: 0,
      b: 0
    };
    this.cycle = 0;
    this.points = [];

    // canvas.width = tempCanvas.width = width;
    // canvas.height= tempCanvas.height= height;

    for (var i = 0; i < 50; i++) {
      var x = Math.random() * this.width, y = Math.random() * this.height, dx = (Math.random()
        * 8) - 4, dy = (Math.random() * 8) - 4, size = Math.floor(Math.random() * 60) + 60;

      this.points.push({
        x: x,
        y: y,
        dx: dx,
        dy: dy,
        size: size
      });
    }

    setTimeout(() => { this.update() }, 10);
  }

  update() {
    var len = this.points.length;
    // this.tempCtx.clearRect(0,0,this.width,this.height);
    this.ctx.clearRect(0, 0, this.width, this.height);
    while (len--) {
      let point = this.points[len];
      point.x += point.dx;
      point.y += point.dy;

      if (point.x > this.width + point.size) {
        point.x = 0 - point.size;
      }
      if (point.x < 0 - point.size) {
        point.x = this.width + point.size;
      }
      if (point.y > this.height + point.size) {
        point.y = 0 - point.size;
      }
      if (point.y < 0 - point.size) {
        point.y = this.height + point.size;
      }

      this.ctx.beginPath();
      var grad = this.ctx.createRadialGradient(point.x, point.y, 1, point.x, point.y, point.size);
      grad.addColorStop(0, 'rgba(' + this.colors.r + ',' + this.colors.g + ',' + this.colors.b
        + ',1)');
      grad.addColorStop(1, 'rgba(' + this.colors.r + ',' + this.colors.g + ',' + this.colors.b
        + ',0)');
      this.ctx.fillStyle = grad;
      this.ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.metabalize();
    this.colorCycle();
    setTimeout(() => { this.update() }, 10);
  }

  colorCycle() {
    this.cycle += 0.1;
    if (this.cycle > 100) {
      this.cycle = 0;
    }
    this.colors.r = ~~(Math.sin(.3 * this.cycle + 0) * 127 + 128);
    this.colors.g = ~~(Math.sin(.3 * this.cycle + 2) * 127 + 128);
    this.colors.b = ~~(Math.sin(.3 * this.cycle + 4) * 127 + 128);
  }

  metabalize() {
    var imageData = this.ctx.getImageData(0, 0, this.width, this.height), pix = imageData.data;

    for (var i = 0, n = pix.length; i < n; i += 4) {
      // Checks threshold
      if (pix[i + 3] < this.threshold) {
        pix[i + 3] /= 6;
        if (pix[i + 3] > this.threshold / 4) {
          pix[i + 3] = 0;
        }
      }
    }
    this.ctx.putImageData(imageData, 0, 0);
  }
}
