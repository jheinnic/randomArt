/**
 * Created by jheinnic on 1/2/17.
 */
import {Component, ViewChild, AfterViewInit, Inject, ElementRef} from "@angular/core";
import {PointStreamService, PointMap, PaintablePoint} from "../stream-play";
import {Observable, Subject} from "rxjs";
import {Chance} from "chance";
import path = require('path');

@Component({
  moduleId: path.resolve(__dirname, __filename),
  selector: "image-lobby",
  template: require("./_image-lobby.view.html"),
  styles: [ require("./_image-lobby.scss") ]
})
export class ImageLobbyComponent implements AfterViewInit
{
  private phraseToPaint: string;

  private cancelSignal: boolean = false;
  private progressInterval: number = 100000;

  private canvasHeight = 480;
  private canvasWidth = 640;
  private scalePoints: Observable<PointMap>;

  @ViewChild('activeCanvas') activeCanvas: ElementRef;
  @ViewChild('sizeCanvasBtn') sizeCanvasBtn: ElementRef;
  @ViewChild('generateNameBtn') generateNameBtn: ElementRef;
  @ViewChild('beginPaintingBtn') beginPaintingBtm: ElementRef;

  private paintJobs = ['phraseToPaint'];

  constructor(private pointService: PointStreamService, @Inject(Chance) private chance) {
    this.createNextPhrase();
  }

  public ngAfterViewInit() {
  }

  private createNextPhrase() {
    let lenOne = this.chance.rpg('1d5')[0] + this.chance.rpg('1d3')[0] + 1;
    let lenTwo = this.chance.rpg('1d5')[0] + this.chance.rpg('1d3')[0] + 1;
    this.phraseToPaint =
      this.chance.word(
        {length: lenOne}
      ) + ' ' + this.chance.word(
        {length: lenTwo}
      );
  }

  public sizeCanvas() {
    console.log('Dialog box TODO');

    let x2, y2;
    if (this.canvasWidth > this.canvasHeight) {
      x2 = this.canvasWidth * 1.0 / this.canvasHeight;
      y2 = 1.0;
    } else {
      x2 = 1.0;
      y2 = this.canvasHeight * 1.0 / this.canvasWidth;
    }

    this.scalePoints =
      this.pointService.mapRectangularRegion(
        this.canvasWidth, this.canvasHeight,
        -1.0 * x2, -1.0 * y2, 2.0 * x2, 2.0 * y2);

    console.log(
      JSON.stringify(
        this.scalePoints));
  }

  public newCanvas() {
    console.log('New Canvas TODO');
  }

  public generateName() {
    this.createNextPhrase();
  }

  public beginPainting() {
    let canvasBefore: HTMLCanvasElement = this.activeCanvas.nativeElement;

    let context: CanvasRenderingContext2D | null = canvasBefore.getContext("2d");
    if (context === null) {
      throw new Error("Could not get 2D context from canvas element");
    } else {
      context = context;
    }

    this.onWordPaintBegin(this.phraseToPaint);
    let counter = 0;
    let outputSubject: Observable<PaintablePoint> =
      this.pointService.performGradualColorTransform(
        this.scalePoints, this.phraseToPaint);

    // Get calculation result, then...
    outputSubject.subscribe((paintPoint: PaintablePoint) => {
      // ...paint into context
      paintPoint.paintTo(context);
      if (counter++ === this.progressInterval) {
        if (this.cancelSignal === true) {
          // TODO: Cancel
          this.onWordPaintCancel(this.phraseToPaint);
          this.cancelSignal = false;
        } else {
          this.onWordPaintProgress(this.phraseToPaint, 0.25)
          counter = 0;
        }
      }
    }, (error) => {
      console.error('Failed to complete paint step!', error);
      this.onWordPaintFail(this.phraseToPaint);
    }, () => {
      console.log('Done');
      this.onWordPaintDone(this.phraseToPaint);
    });
  }

  public cancelPainting() {
    this.cancelSignal = true;
  }

  public onSelectChip(self, $event) {
    console.log("Chip self = ", self);
    console.log("Chip $event = ", $event);
  }

  //
  // Event Handlers for compopnentized wordpaint canvas TODO
  //

  public onCanvasReady(eventTime) {
    console.log("Auto word component was signalled onCanvasReady from wordPaint at "
      + eventTime);
  }

  public onWordPaintBegin(currentWord) {

  }

  public onWordPaintProgress(currentWord, pctDone) {
    console.log("Progress update TODO!");
  }

  public onWordPaintFail(currentWord) {

  }

  public onWordPaintCancel(currentWord) {

  }

  public onWordPaintDone(currentWord) {
    console.log("Auto word component was signalled onWordComplete from wordPaint");
  }
}
