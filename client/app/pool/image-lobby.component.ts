/**
 * Created by jheinnic on 1/2/17.
 */
import {Component, ViewChild, AfterViewInit, ElementRef, NgZone} from "@angular/core";
import {PointStreamService, PointMap, PaintablePoint} from "../stream-play";
import {Observable} from "rxjs";
import {PhraseGeneratorService} from "../shared/phrase-generator/phrase-generator.service";
import {ArtworkApi} from "../shared/sdk/services/custom/Artwork";
import Tether = require('tether');
import path = require('path');
import _ = require('lodash');

interface PaintDone
{
  phrasePainted: string,
  whenDismissed: Date,
  imageData: Blob /*ImageData*/
}

interface PaintToDo
{
  phraseToPaint: string
}

const MAX_BUFFER_SIZE: number = 2000;
const LIVE_LATENCY: number = 600;


@Component({
  moduleId: "./app/pool",
  selector: "image-lobby",
  template: require("./_image-lobby.view.html"),
  styleUrls: ["./_image-lobby.scss"]
})
export class ImageLobbyComponent
{
  private phrasePainting: string;
  private phrasePainted: string;
  private cancelSignal: boolean = false;

  private canvasHeight = 480;
  private canvasWidth = 640;

  private scalePoints: Observable<PointMap>;
  private context: CanvasRenderingContext2D | null;

  public paintJobsNext: PaintToDo[];
  public paintJobsDone: PaintDone[];

  @ViewChild('wordPaint') wordPaintCanvas: ElementRef;
  @ViewChild('resizeCanvasBtn') resizeCanvasBtn: ElementRef;
  @ViewChild('generateNameBtn') generateNameBtn: ElementRef;
  @ViewChild('startPaintingBtn') startPaintingBtm: ElementRef;

  constructor(
    private readonly ngZone: NgZone, private readonly artworkApi: ArtworkApi,
    private readonly pointService: PointStreamService,
    private readonly phraseGenerator: PhraseGeneratorService
  ) {
    this.paintJobsNext = [
      {phraseToPaint: this.phraseGenerator.createNextPhrase()}
    ];
    this.paintJobsDone = [
      {
        phrasePainted: 'Placeholder One',
        whenDismissed: new Date(),
        imageData: null
      }
    ];
  }

  get phraseToPaint(): string {
    let retVal: string = '';
    if (this.paintJobsNext.length >= 1) {
      retVal = this.paintJobsNext[0].phraseToPaint;
    }
    return retVal;
  }

  get hasPainted(): boolean {
    return _.isString(this.phrasePainted);
  }

  get isPainting(): boolean {
    return _.isString(this.phrasePainting);
  }

  get willPaint(): boolean {
    return !this.isPainting && (this.paintJobsNext.length > 0);
  }

  public sizeCanvas() {
    this.scalePoints =
      this.pointService.mapRectangularRegion(this.canvasWidth, this.canvasHeight);
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

    if (!this.scalePoints) {
      this.sizeCanvas();
    }

    this.phrasePainting = this.paintJobsNext.shift().phraseToPaint;
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.doPaintWord();
      }, 1);
    });
    this.onWordPaintBegin(this.phrasePainting);
  }

  private doPaintWord() {
    const pixelCount = this.canvasWidth * this.canvasHeight;
    const outputSubject: Observable<[PaintablePoint[], number]> =
      this.pointService.performGradualColorTransform(
        this.scalePoints, pixelCount, this.phrasePainting, LIVE_LATENCY, MAX_BUFFER_SIZE);

    // Get calculation result, then...
    let iterCounter = 0;
    let pixelCounter = 0;
    outputSubject.subscribe((paintPoints: [PaintablePoint[],number]) => {
      // ...paint into context
      paintPoints[0].forEach(function (paintPoint) {
        paintPoint.paintTo(this.context);
      });

      this.ngZone.run(() => {
        this.onWordPaintProgress(this.phrasePainting, paintPoints[1]);

        if (this.cancelSignal === true) {
          let temp = this.phrasePainting;
          this.phrasePainting = null;
          this.cancelSignal = false;
          console.log('Cancelled');
          this.onWordPaintCancel(temp);
        }
      });
    }, (error) => {
      console.error('Failed to complete paint step!', error);
      this.ngZone.run(() => {
        let temp = this.phrasePainting;
        this.phrasePainting = null;
        this.cancelSignal = false;
        this.onWordPaintFail(temp);
      });
    }, () => {
      this.ngZone.run(() => {
        this.phrasePainted = this.phrasePainting;
        this.phrasePainting = null;
        this.cancelSignal = false;
        this.onWordPaintDone(this.phrasePainted);
      });
    });

    console.log('Done');
  }

  public cancelPainting() {
    this.cancelSignal = true;
  }

  public dismissIfFinished( imageData: Blob ) {
    if (this.phrasePainted > '') {
      /*let imageData = this.context.getImageData();*/
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
    if (this.paintJobsNext.length > 0) {
      this.context.fillStyle = 'rgb(0,0,0)';
      this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.beginPainting();
    }
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

  public onWordPaintDone(completedPhrase) {
    let canvas = this.context.canvas

    // TODO: Try using the toBlob() method instead of this hackish looking snippet
    let base64Data: string = canvas.toDataURL('image/png')
      .replace(/^data:image\/(png|jpeg|jpg|gif);base64,/, '');
    console.log(base64Data);
    let imageData: Blob = base64toBlob(base64Data, 'image/png');

    let result: Observable<any> = this.artworkApi.upload(
      completedPhrase, this.canvasWidth, this.canvasHeight, base64Data);

    result.subscribe(
      (data) => { }, (err) => { console.error(err); },
      () => { this.dismissIfFinished(imageData); }
    );
  }
}

/**
 * Converts a base64 string to byte array.
 */
function base64toBlob(
  base64Data: string, contentType: string = '', sliceSize: number = 512
): Blob {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, {type: contentType});
}
