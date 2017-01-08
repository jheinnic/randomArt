/**
 * Created by jheinnic on 12/25/16.
 */
import {Injectable} from "@angular/core";
import {
  WordPaintDataModel, WordPaintEvent, WordPaintStatus, ProgressUpdateEvent,
  WordPaintDataModelBuilder, TaskCancelledEvent, TaskCompletedEvent, CanvasReadyEvent
} from "./word-paint.datamodel";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {ReplaySubject} from "rxjs/ReplaySubject";
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

function computeAffinePixelPoints(pointCount, minValue, maxValue) {
  var initial: number;
  if ((pointCount % 2) == 0) {
    initial = 0.5;
  } else {
    initial = 0;
  }

  const translate: number = 0 + minValue;
  const scale: number = (maxValue - minValue) / (pointCount - 0);

  let pointsArray = [];
  for (let ii = initial; ii < pointCount; ii += 1) {
    pointsArray.push((ii * scale) + translate);
  }
  return pointsArray;
}


const oneHundred: number = 100.0;
const tenThousand: number = 10000.0;

@Injectable()
export class WordPaintService
{
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

  private state: WordPaintDataModel = new WordPaintDataModel({
    sequenceId: 1,
    status: WordPaintStatus.notInitialized,
    currentWord: null,
    pctDone: -1
  });

  private stateStream: BehaviorSubject<WordPaintDataModel> = new BehaviorSubject<WordPaintDataModel>(this.state);
  private eventStream: ReplaySubject<WordPaintEvent> = new ReplaySubject<WordPaintEvent>(10, 100);


  public constructor() { }

  get currentState() {
    return this.stateStream.asObservable();
  }

  get changeEvents() {
    return this.eventStream.asObservable();
  }

  public submitNextTask(nextPhrase: string) {
    if (this.initialized === false) {
      throw new Error("WordPaint service must be initialized before it can accept word phrase tasks.");
    } else if (this.state.status !== WordPaintStatus.readyForWord) {
      throw new Error('Word paint service is not in a readyForWord state.  status='
        + this.state);
    } else {
      this.pixelModel = modelFactory.new_picture(nextPhrase);
      this.context.fillStyle = "rgb(255,255,255)";
      this.context.fillRect(0, 0, this.width, this.height);

      this.actualProgress = this.progressPoints.slice(0);
      this.ki = 0;

      console.log('Word paint is enqueuing the first block of work!');
      this.reportProgress(nextPhrase, 0.0);
      setTimeout(this.continueTask, 0);
    }
  }

  private finishTask() {
    console.log('Stream service asked to send finishTask for ' + this.state.currentWord
      + ' with state = ' + JSON.stringify(this.state));
    const event: TaskCompletedEvent = new TaskCompletedEvent(this.state.sequenceId
      + 1, this.state.currentWord);

    this.state = this.state.copy(
      (builder: WordPaintDataModelBuilder) => { builder.visitCompleted(event); });
    this.stateStream.next(this.state);
    this.eventStream.next(event);
  }

  cancelTask() {
    const event: TaskCancelledEvent = new TaskCancelledEvent(this.state.sequenceId
      + 1, this.state.currentWord);

    this.state = this.state.copy(
      (builder: WordPaintDataModelBuilder) => { builder.visitCancelled(event); });
    this.stateStream.next(this.state);
    this.eventStream.next(event);
  }

  private reportProgress(currentPhrase: string, pctDone: number) {
    const event: ProgressUpdateEvent = new ProgressUpdateEvent(this.state.sequenceId
      + 1, currentPhrase, pctDone);

    this.state = this.state.copy(
      (builder: WordPaintDataModelBuilder) => { builder.visitUpdate(event); });
    this.stateStream.next(this.state);
    this.eventStream.next(event);
  }

  public initTargetCanvas(canvas: HTMLCanvasElement, workIntervalSize: number): void {
    let context: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (context === null) {
      throw new Error("Could not get 2D context from canvas element");
    } else {
      this.context = context;
    }

    this.height = canvas.height;
    this.width = canvas.width;

    this.pixelCount = this.height * this.width;
    this.workIntervalSize = workIntervalSize;
    console.log('About to precompute points in wordPaint service.  Uploading...');

// Precompute the mapping between pixel indices and coordinate positions.
    // this.widthPoints = computePixelPoints(this.width);
    // this.heightPoints = computePixelPoints(this.height);
    this.heightPoints = this.widthPoints = computeAffinePixelPoints(this.width, -1.0, 1.0);
    // this.heightPoints = computeAffinePixelPoints(this.height, -1.0, 1.0);

// Precompute the percent complete terminal points for each work iteration.
    this.progressPoints = [];
    for (let ii = 0; ii < this.height; ii += this.workIntervalSize) {
      let pctDone = Math.round(ii * tenThousand / this.height) / oneHundred;
      this.progressPoints.push(pctDone);
    }

// Sidestep any possibility of numeric precision errors hiding end-of-task condition.
    this.progressPoints.shift();
    this.progressPoints.push(oneHundred);
    this.progressPoints.reverse();

    this.initialized = true;
    console.log('Word paint service has initialized its canvas');
    this.announceReady();
  }

  public confirmDone() {
    if (this.state.status !== WordPaintStatus.cleaningUp) {
      throw new Error('Word paint service is not waiting for post-task cleanup confirmation..'
        + '  status='
        + this.state);
    } else {
      this.announceReady();
    }
  }

  private announceReady() {
    const event: CanvasReadyEvent = new CanvasReadyEvent(this.state.sequenceId + 1);
    this.state = this.state.copy(
      (builder: WordPaintDataModelBuilder) => { builder.visitReady(event)});
    this.stateStream.next(this.state);
    this.eventStream.next(event);
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
      let nextPctDone = this.actualProgress.pop() || oneHundred;
      console.log('Word paint is now ' + nextPctDone
        + ' complete and ready to paint another block!');
      this.reportProgress(this.state.currentWord, nextPctDone);
      setTimeout(this.continueTask, 2);
    } else {
      console.log('Word paint is done and ready to queue a complete event!');
      this.finishTask();
    }
  }

}
