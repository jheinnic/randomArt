/**
 * Created by jheinnic on 12/25/16.
 */
import {Injectable, Host} from "@angular/core";
import {WordStreamService, BeginWordPaintTaskEvent, WordPaintEventType, WordPaintEvent} from ".";
import {Subscription} from "rxjs/Subscription";
import * as modelFactory from "./genjs";

function computeEvenPixelPoints(pointCount) {
  const initial: number = 0.5;
  const scale: number = pointCount;

  let pointsArray = [];
  for (let ii = initial; ii < pointCount; ii += 1) {
    pointsArray.push((2 * ii / scale) - 1.0);
  }
  return pointsArray;
}

function computeOddPixelPoints(pointCount) {
  const initial: number = 0.0;
  const scale: number = pointCount - 1.0;

  let pointsArray = [];
  for (let ii = initial; ii < pointCount; ii += 1) {
    pointsArray.push((2 * ii / scale) - 1.0);
  }
  return pointsArray;
}

function computePixelPoints(pointCount) {
  let retVal;
  if ((pointCount % 2) === 0) {
    retVal = computeEvenPixelPoints(pointCount);
  } else {
    retVal = computeOddPixelPoints(pointCount);
  }

  return retVal;
}

const oneHundred: number = 100.0;
const tenThousand: number = 10000.0;

@Injectable()
export class WordPaintService {
  private context: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  // Encapsulation for artifacts from 'genjs.js'
  private pixelModel: any;

  private pixelCount: number;
  private widthPoints: number[];
  private heightPoints: number[];

  private progressPoints: number[];
  private actualProgress: number[] = [];
  private workIntervalSize: number;
  private ki: number = 0;

  private initialized: boolean = false;
  private subscription: Subscription;
  private wordStreamService: WordStreamService;
  private currentWord: string|null = null;

  public constructor(@Host() wordStreamService: WordStreamService) {
    this.currentWord = null;
    this.wordStreamService = wordStreamService;
    this.subscription = wordStreamService.getTaskStream().subscribe((event: WordPaintEvent) => {
      let beginEvent: BeginWordPaintTaskEvent;
      console.log("Paint service handles event:" + JSON.stringify(event));
      console.log(
        'beginTask event type is ' + WordPaintEventType.beginTask + ', and comparison is ' +
        (event.eventType === WordPaintEventType.beginTask));

      switch (event.eventType) {
        case (WordPaintEventType.beginTask): {
          beginEvent = event as BeginWordPaintTaskEvent;
          console.log('In begin handler, currentWord is presently <' + this.currentWord + '>');
          if (this.currentWord !== null) {
            // TODO: Begin has already been emitted.  Would be better to use
            //       Drop to abort, but Cancel is required due to Begin.
            console.log('Decided to cancel task');
            this.wordStreamService.cancelTask(beginEvent.taskWord);
          } else {
            console.log('Decided to paint ' + beginEvent.taskWord);
            this.currentWord = beginEvent.taskWord;
            this.beginTask(this.currentWord);
          }
          break;
        }
        default: {
          console.log("Routed to default handler for " + event.eventType);
          break;
        }
      }
    });
  }

  // public initTargetCanvas( phrase: string, height: number, width: number, canvas: HTMLCanvasElement)
  public initTargetCanvas(canvas: HTMLCanvasElement, workIntervalSize: number): void {
    let pctDone: number;
    let context: CanvasRenderingContext2D|null = canvas.getContext("2d");
    if (context === null) {
      throw new Error("Could not get 2D context from canvas element");
    } else {
      this.context = context;
    }

    this.height = canvas.height;
    this.width = canvas.width;

    this.pixelCount = this.height * this.width;
    this.workIntervalSize = workIntervalSize;

    // Precompute the mapping between pixel indices and coordinate positions.
    this.widthPoints = computePixelPoints(this.width);
    this.heightPoints = computePixelPoints(this.height);

    // Precompute the percent complete terminal points for each work iteration.
    this.progressPoints = [];
    for (let ii = 0; ii < this.height; ii += this.workIntervalSize) {
      pctDone = Math.round(ii * tenThousand / this.height) / oneHundred;
      this.progressPoints.push(pctDone);
    }

    // Sidestep any possibility of numeric precision errors hiding end-of-task condition.
    this.progressPoints.shift();
    this.progressPoints.push(oneHundred);
    this.progressPoints.reverse();

    this.initialized = true;
    console.log('Word paint service has initialized its canvas');
  }

  private beginTask(nextPhrase: string) {
    if (this.initialized === false) {
      throw new Error("WordPaint service must be initialized before it can accept word phrase tasks.");
    }
    if (this.actualProgress.length > 0) {
      throw new Error("Cannot begin painting <" + nextPhrase + ">.  Cancel or complete the current pending task first.");
    }

    this.pixelModel = modelFactory.new_picture(nextPhrase);
    this.context.fillStyle = "rgb(255,255,255)";
    this.context.fillRect(0, 0, this.width, this.height);

    this.actualProgress = this.progressPoints.slice(0);
    this.ki = 0;

    console.log('Word paint is enqueuing the first block of work!');
    setTimeout(this.continueTask, 0);
  }

  public cancelTask() {
    // TODO: Account for possible pending setTimeout callbacks
    this.wordStreamService.finishTask(this.currentWord || '');
    this.actualProgress = [];
    this.currentWord = null;
  }

  continueTask = () => {
    let pctDone = 0;
    if (this.initialized === false) {
      throw new Error("WordPaint service must be initialized and given a phrase task before it can continue painting.");
    }
    if (this.actualProgress.length <= 0) {
      throw new Error("No unfinished task available to continue painting.  Call beginTask() before next attempt.");
    }
    console.log('Word paint is about to paint a block!');

    let yMax = Math.min(this.ki + this.workIntervalSize, this.height);
    for (let yi = this.ki; yi < yMax; yi++) {
      let yMap = this.heightPoints[yi];

      for (let xi = 0; xi < this.width; xi++) {
        let xMap = this.widthPoints[xi];

        this.context.fillStyle = modelFactory.compute_pixel(this.pixelModel, xMap, yMap);
        // console.log('Point (' + xi + ', ' + yi + ') is ' + this.context.fillStyle);
        this.context.fillRect(xi, yi, 1, 1);
      }
    }

    // Return the percent completed by popping the pre-calculated progress stack.
    this.ki = yMax;
    if (this.ki < this.height) {
      pctDone = this.actualProgress.pop() || oneHundred;
      console.log('Word paint is ' + pctDone + ' complete and ready to paint another block!');
      this.wordStreamService.reportProgress(this.currentWord || '', pctDone);
      setTimeout(this.continueTask, 2);
    } else {
      console.log('Word paint is done and ready to queue a complete event!');
      this.wordStreamService.reportProgress(this.currentWord || '', oneHundred);
      this.wordStreamService.finishTask(this.currentWord || '');
      this.currentWord = null;
    }
  }
}
