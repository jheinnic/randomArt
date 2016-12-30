/**
 * Created by jheinnic on 12/25/16.
 */
import {OnInit, OnDestroy, AfterViewInit, ViewChild, EventEmitter, Component, Input, Output} from "@angular/core";
import {WordPaintService} from "./word_paint.service";
import {WordStreamService, WordPaintEvent, BeginWordPaintTaskEvent, CompleteWordPaintTaskEvent, WordPaintEventType } from "./word_stream.service";
import {Subscription} from "rxjs/Subscription";
import * as path from "path";

@Component({
  moduleId: path.relative(__dirname, __filename),
  selector: 'word_paint',
  templateUrl: './_word_paint.view.html',
  styleUrls: ['./_word_paint.scss']
})
export class WordPaintComponent implements OnInit, AfterViewInit, OnDestroy {
  private wordPaintService: WordPaintService;
  private wordStreamService: WordStreamService;
  private subscription: Subscription;
  private currentWord: string;

  @ViewChild("wordPaint") canvasElement;

  @Input() size: number = 800;
  @Input() workUnit: number = 20;

  @Output() private began: EventEmitter<string> = new EventEmitter<string>();
  @Output() private completed: EventEmitter<string> = new EventEmitter<string>();
  @Output() private progress: EventEmitter<number> = new EventEmitter<number>();

  constructor(wordPaintService: WordPaintService, wordStreamService: WordStreamService) {
    this.wordPaintService = wordPaintService;
    this.wordStreamService = wordStreamService;
    this.currentWord = '';
  }

  get height() {
    return this.size;
  }

  get width() {
    return this.size;
  }

  ngOnInit() {
    this.subscription = this.wordStreamService.getTaskStream().subscribe((event: WordPaintEvent) => {
      let beginEvent: BeginWordPaintTaskEvent;
      let completeEvent: CompleteWordPaintTaskEvent;
      console.log("Paint component handles event:" + JSON.stringify(event));

      switch (event.eventType) {
        case (WordPaintEventType.beginTask): {
          beginEvent = event as BeginWordPaintTaskEvent;
          this.began.emit(beginEvent.taskWord);
          break;
        }
        case (WordPaintEventType.completeTask): {
          completeEvent = event as CompleteWordPaintTaskEvent;
          this.completed.emit(completeEvent.taskWord);
          break;
        }
      }
    });
  }

  ngAfterViewInit() {
    let canvas: HTMLCanvasElement = this.canvasElement.nativeElement;
    console.log("Work unit size requested is: " + this.workUnit);
    this.wordPaintService.initTargetCanvas(canvas, this.workUnit);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
