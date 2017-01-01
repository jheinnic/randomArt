/**
 * Created by jheinnic on 12/25/16.
 */
import {
  OnInit, OnDestroy, AfterViewInit, ViewChild, EventEmitter, Component, Input, Output
} from "@angular/core";
import {WordPaintService} from "./word-paint.service";
import {
  WordPaintEvent, CanvasReadyEvent, TaskCompletedEvent, ProgressUpdateEvent,
  WordPaintEventVisitor, WordPaintStatus, TaskCancelledEvent
} from "./word-paint.datamodel";
import {Subscription} from "rxjs/Subscription";
import * as path from "path";

@Component({
  moduleId: path.relative(__dirname, __filename),
  selector: 'wordPaint',
  templateUrl: './_word-paint.view.html'
})
export class WordPaintComponent implements OnInit, AfterViewInit, OnDestroy, WordPaintEventVisitor {
  private subscription: Subscription;

  private currentWord: string|null = null;
  private previousWord: string|null = null;
  private percentDone: number = -1;
  private status: WordPaintStatus = WordPaintStatus.notInitialized;

  @ViewChild("wordPaint") canvasElement;

  @Input() size: number = 800;
  @Input() workUnit: number = 20;

  @Output() ready: EventEmitter<string> = new EventEmitter<string>();
  @Output() completed: EventEmitter<string> = new EventEmitter<string>();
  @Output() progress: EventEmitter<number> = new EventEmitter<number>();

  constructor(private wordPaintService: WordPaintService) {
    this.currentWord = '';
    this.previousWord = '';
  }

  get height() {
    return this.size;
  }

  get width() {
    return this.size;
  }

  get pctDone() {
    let retVal:number = null;
    if (this.percentDone >= 0) { retVal = this.percentDone; }
    return retVal;
  }

  ngOnInit() {
    console.log("Word paint component is subscribing for service events");
    this.subscription = this.wordPaintService.changeEvents.subscribe(
      (event: WordPaintEvent) => {
        console.log("Word paint component received " + JSON.stringify(event) + " from"
          + " service");
        event.accept(this);
      }
    );
  }

  ngAfterViewInit() {
    let canvas: HTMLCanvasElement = this.canvasElement.nativeElement;
    console.log("Canvas component is about to initialize canvas.  Work unit size requested is:"
      + " " + this.workUnit + " and size requested = " + this.size);
    this.wordPaintService.initTargetCanvas(canvas, this.workUnit);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public visitReady(event: CanvasReadyEvent) {
    console.log("Word paint component is processing a visitReady event");
    this.status = WordPaintStatus.readyForWord;
    this.ready.emit('ready');
  }

  public visitUpdate(event: ProgressUpdateEvent) {
    console.log("Word paint component is updating percent complete to " + event.pctDone );
    this.status = WordPaintStatus.busyPainting;
    this.currentWord = event.taskWord;
    this.percentDone = event.pctDone;
  }

  public visitCancelled(event: TaskCancelledEvent) {
    this.status = WordPaintStatus.readyForWord;
    this.previousWord = this.currentWord;
    this.currentWord = null;
    this.percentDone = null;
  }

  public visitCompleted(event: TaskCompletedEvent) {
    console.log("Word paint component is waiting for cleanup...");
    this.status = WordPaintStatus.cleaningUp;
    this.previousWord = event.taskWord;
    this.currentWord = null;
    this.percentDone = null;
    this.completed.emit(event.taskWord);
  }

  // ngAfterViewChecked() {
  //   setTimeout(this.paintOneIteration, 1);
  // }
  //
  // private paintOneIteration = () => {
  //   let pctDone = this.wordPaintService.continueTask();
  //   console.log('Painted one more interval');
  //   this.progress.emit(pctDone);
  // }
}
