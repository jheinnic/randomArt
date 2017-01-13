/**
 * Created by jheinnic on 1/2/17.
 */
import {Component, ViewChild, AfterViewInit, Inject, ElementRef, NgZone} from "@angular/core";
import {PointStreamService, PointMap, PaintablePoint} from "../stream-play";
import {Observable, Subject} from "rxjs";
import {Chance} from "chance";
import Tether = require('tether');
import path = require('path');
import _ = require('lodash');
import {PhraseGeneratorService} from "../shared/phrase-generator/phrase-generator.service";

interface PaintDone {
  phrasePainted: string,
  whenDismissed: Date,
  imageData: ImageData
};
interface PaintToDo {
  phraseToPaint: string
};

@Component({
  moduleId: path.resolve(__dirname, __filename),
  selector: "image-lobby",
  template: require("./_image-lobby.view.html"),
  styles: [ require("./_image-lobby.scss") ]
})
export class ImageLobbyComponent implements AfterViewInit
{
  private phrasePainting: string;
  private phrasePainted: string;

  private cancelSignal: boolean = false;
  private progressInterval: number = 100000;

  private canvasHeight = 480;
  private canvasWidth = 640;
  private scalePoints: Observable<PointMap>;
  private context: CanvasRenderingContext2D | null;

  private sidenav: ElementRef = null;

  public paintJobsNext: PaintToDo[];
  public paintJobsDone: PaintDone[];

  private iconToText() {
    // TODO
  };


  @ViewChild('wordPaint') wordPaintCanvas: ElementRef;
  @ViewChild('resizeCanvasBtn') resizeCanvasBtn: ElementRef;
  @ViewChild('generateNameBtn') generateNameBtn: ElementRef;
  @ViewChild('startPaintingBtn') startPaintingBtm: ElementRef;

  get hasPainted(): boolean {
    return _.isString(this.phrasePainted);
  }

  get isPainting(): boolean {
    return _.isString(this.phrasePainting);
  }

  get willPaint(): boolean {
    return !this.isPainting && (this.paintJobsNext.length > 0);
  }

  constructor(
    private ngZone: NgZone,
    private pointService: PointStreamService,
    private phraseGenerator: PhraseGeneratorService
  ) {
    this.paintJobsNext = [
      { phraseToPaint: this.phraseGenerator.createNextPhrase() }
    ];
    this.paintJobsDone = [
      {phrasePainted: 'Placeholder One', whenDismissed: new Date(), imageData: null},
      {phrasePainted: 'Placeholder Two', whenDismissed: new Date(), imageData: null}
    ];
  }

  public ngAfterViewInit() {
    /*
    new Tether({
      element: '#open-sidenav',
      target: '#image-create-panel',
      attachment: 'top left',
      targetAttachment: 'top left',
      constraints: [{
        to: 'window',
        pin: true
      }]
    });
    */
  }

  get phraseToPaint() {
    let retVal:string = '';
    if (this.paintJobsNext.length >= 1) {
      retVal = this.paintJobsNext[0].phraseToPaint;
    }
    return retVal;
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

  public renameNext() {
    this.paintJobsNext.unshift();
    this.scheduleNext();
  }

  public scheduleNext() {
    this.paintJobsNext.push({
      phraseToPaint: this.phraseGenerator.createNextPhrase()
    });
  }

  public beginPainting() {
    let canvasBefore: HTMLCanvasElement = this.wordPaintCanvas.nativeElement;

    if (this.paintJobsNext.length < 1) {
      throw new Error("No jobs in queue left to paint!");
    }
    if (this.isPainting) {
      throw new Error('A paint job is already in progress!');
    }
    this.context = canvasBefore.getContext('2d', {storage: true});
    if (this.context === null) {
      throw new Error("Could not get 2D context from canvas element");
    }

    if (! this.scalePoints) {
      this.sizeCanvas();
    }

    this.ngZone.runOutsideAngular( () => {
      setTimeout( () => { this.doPaintWord(); }, 5);
    });
  }

  private doPaintWord() {
    this.phrasePainting = this.paintJobsNext.shift().phraseToPaint;

    this.onWordPaintBegin(this.phrasePainting);
    let counter = 0;
    let outputSubject: Observable<PaintablePoint> =
      this.pointService.performGradualColorTransform(
        this.scalePoints, this.phrasePainting);
    // Get calculation result, then...
    outputSubject.subscribe((paintPoint: PaintablePoint) => {
      // ...paint into context
      paintPoint.paintTo(this.context);
      if (counter++ === this.progressInterval) {
        this.ngZone.run( () => {
          if (this.cancelSignal === true) {
            // TODO: Cancel
            this.phrasePainting = null;
            this.onWordPaintCancel(this.phrasePainting);
            console.log('Cancelled');
            this.cancelSignal = false;
          } else {
            this.onWordPaintProgress(this.phrasePainting, 0.25)
            counter = 0;
          }
        });
      }
    }, (error) => {
      console.error('Failed to complete paint step!', error);
      this.onWordPaintFail(this.phraseToPaint);
    }, () => {
        this.ngZone.run( () => {
        this.phrasePainted = this.phrasePainting;
        this.phrasePainting = null;
        this.onWordPaintDone(this.phrasePainted);
      })
      console.log('Done');
    });
  }

  public cancelPainting() {
    this.cancelSignal = true;
  }

  public dismissIfFinished() {
    if (this.phrasePainted > '') {
      let imageData = this.wordPaintCanvas.nativeElement.getImageData();
      let whenDismissed = new Date()
      this.paintJobsDone.push({
         phrasePainted: this.phrasePainted,
         whenDismissed: whenDismissed,
         imageData: imageData
      });
      this.phrasePainted = null;
      this.onCanvasReady(whenDismissed);
    }
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
