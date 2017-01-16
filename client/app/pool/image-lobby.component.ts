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
  moduleId: path.resolve(__dirname, __filename),
  selector: "image-lobby",
  template: require("./_image-lobby.view.html"),
  styles: [require("./_image-lobby.scss")]
})
export class ImageLobbyComponent implements AfterViewInit
{
  private phrasePainting: string;
  private phrasePainted: string;

  private cancelSignal: boolean = false;
  private progressInterval: number = 100000;

  private canvasHeight = 480;
  private canvasWidth = 640;
  private jpegQuality = 0.95;

  private scalePoints: Observable<PointMap>;
  private context: CanvasRenderingContext2D | null;
  private imageData: Blob;

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

  private iconToText() {
    // TODO
  };

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

    this.scalePoints = this.pointService.mapRectangularRegion(this.canvasWidth, this.canvasHeight, -1.0
      * x2, -1.0 * y2, 2.0 * x2, 2.0 * y2);

    console.log(JSON.stringify(this.scalePoints));
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
    const bufferSize = findOptimalDivisor(pixelCount, MAX_BUFFER_SIZE);
    const numIterations = pixelCount / bufferSize;
    const outputSubject: Observable<PaintablePoint> =
      this.pointService.performGradualColorTransform(
        this.scalePoints, this.phrasePainting, bufferSize, LIVE_LATENCY);

    // Get calculation result, then...
    let iterCounter = 0;
    let pixelCounter = 0;
    outputSubject.subscribe((paintPoint: PaintablePoint) => {
      // ...paint into context
      paintPoint.paintTo(this.context);
      if (pixelCounter++ === this.progressInterval) {
        pixelCounter = 0;
        iterCounter += 1;
        setTimeout(() => {
          this.ngZone.run(() => {
            if (this.cancelSignal === true) {
              let temp = this.phrasePainting;
              this.phrasePainting = null;
              this.cancelSignal = false;
              console.log('Cancelled');
              this.onWordPaintCancel(temp);
            } else {
              this.onWordPaintProgress(this.phrasePainting, iterCounter / numIterations)
            }
          });
        }, 1);
      }
    }, (error) => {
      setTimeout(() => {
        this.ngZone.run(() => {
          console.error('Failed to complete paint step!', error);
          this.onWordPaintFail(this.phraseToPaint);
        });
      }, 1);
    }, () => {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.phrasePainted = this.phrasePainting;
          this.phrasePainting = null;
          this.onWordPaintDone(this.phrasePainted);
        });
      }, 1);
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
    let base64: string = canvas.toDataURL('image/png')
      .replace(/^data:image\/(png|jpeg|jpg|gif);base64,/, '');
    console.log(base64);
    let imageData: Blob = base64toBlob(base64, 'image/png');

    let result: Observable<any> = this.artworkApi.upload(
      completedPhrase, this.canvasWidth, this.canvasHeight, base64);

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
  var byteCharacters = atob(base64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);
    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, {type: contentType});
}

function gcf(width, height) {
  return ( height == 0 ) ? (width) : ( gcf(height, width % height) );
}

function listDivisors(n) {
  if (n < 1) {
    throw "Argument error";
  }

  var small = [];
  var large = [];
  var end = Math.floor(Math.sqrt(n));
  for (var i = 1; i <= end; i++) {
    if (n % i == 0) {
      small.push(i);
      if (i * i != n)  // Don't include a square root twice
      {
        large.push(n / i);
      }
    }
  }
  large.reverse();
  return small.concat(large);
}

/**
 * Find the largest possible divisor of multiplicand that no greater than maxDivisor.
 *
 * @param multiplicand
 * @param maxDivisor
 */
function findOptimalDivisor(multiplicand: number, maxDivisor: number) {
  if ((multiplicand % maxDivisor) === 0) {
    return maxDivisor;
  }

  var ii;
  var sqrt = Math.floor(Math.sqrt(multiplicand));
  if (sqrt > maxDivisor) {
    for (ii = maxDivisor; ii > 1; ii--) {
      if ((multiplicand % ii) == 0) {
        // console.log('a');
        return ii;
      }
    }

    return 1;
  } else {
    var highLowHigh = 0;
    for (ii = sqrt; highLowHigh === 0; ii--) {
      // console.log(ii);
      if ((multiplicand % ii) == 0) {
        highLowHigh = ii;
      }
    }

    var firstFound = true;
    var lowLowHigh = 0;
    for (ii = 2; ii < highLowHigh && lowLowHigh === 0; ii++) {
      // console.log(ii);
      if ((multiplicand % ii) == 0) {
        lowLowHigh = multiplicand / ii;
        if (lowLowHigh > maxDivisor) {
          lowLowHigh = 0;
          firstFound = false;
        }
      }
    }
    if ((lowLowHigh > 0) && firstFound) {
      // console.log('b');
      return lowLowHigh;
    }

    var minHighHigh = 0;
    var altHighLowHigh = multiplicand / highLowHigh;
    if (altHighLowHigh <= maxDivisor) {
      highLowHigh = altHighLowHigh;
      minHighHigh = highLowHigh;
    } else {
      minHighHigh = sqrt;
    }

    // console.log(lowLowHigh, minHighHigh, highLowHigh, altHighLowHigh);

    if (lowLowHigh > highLowHigh) {
      highLowHigh = lowLowHigh;
      minHighHigh = lowLowHigh;
    }

    /*
     var half = Math.floor(multiplicand / 2);
     for(ii=Math.min(half, maxDivisor); ii>minHighHigh; ii--) {
     // console.log(ii);
     if ((multiplicand % ii) === 0) {
     // console.log('c');
     return ii;
     }
     }
     */

    // console.log('d');
    return highLowHigh
  }
}
