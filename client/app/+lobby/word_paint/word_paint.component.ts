/**
 * Created by jheinnic on 12/25/16.
 */
import {AfterContentChecked, AfterViewChecked, ElementRef, EventEmitter, Component, Optional, Output } from '@angular/core';
import {WordPaintService} from '.';
import {WordStreamService} from '../word_stream'
import * as path from "path";

@Component({
  moduleId: path.relative(__dirname, __filename),
  selector: 'word_paint',
  templateUrl: './_word_paint.view.html',
  styleUrls: ['./_word_paint.scss'],
  providers: [
    { provide: WordPaintService, useClass: WordPaintService }
  ]
})
export class WordPaintComponent implements AfterContentChecked, AfterViewChecked {
  private elementRef: ElementRef;
  private wordPaintService: WordPaintService;

  // private onBeginEventName: string;
  // private onCompleteEventName: string;
  // private onCancelEventName: string;

  @Output() private paintCompleted: EventEmitter<String> = new EventEmitter<String>();
  // @Output() private paintCancelled: EventEmitter<String> = new EventEmitter<String>();

  constructor(
    elementRef: ElementRef
    // wordPaintService: WordPaintService
    // @Inject(WordPaintOnBeginEventName) onBeginEventName: string,
    // @Inject(WordPaintOnCancelEventName) onCancelEventName: string,
    // @Inject(WordPaintOnCompleteEventName) onCompleteEventName: string
  ) {
    this.elementRef = elementRef;
    // this.wordPaintService = wordPaintService;
    // this.onBeginEventName = onBeginEventName;
    // this.onCompleteEventName = onCompleteEventName;
    // this.onCancelEventName = onCancelEventName;
  }

  ngAfterContentChecked() {
    this.paintOneIteration('forContent');
  }

  ngAfterViewChecked() {
    this.paintOneIteration('forView');
  }

  private paintOneIteration(origin: string) {
    console.log('About to paint one interval ' + origin);

    // TODO: Use objects here.
    if (this.wordPaintService.doNextInterval() < 100) {
      this.paintCompleted.emit('onComplete');
    }
  }
}
