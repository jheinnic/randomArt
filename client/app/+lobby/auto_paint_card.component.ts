/**
 * Created by jheinnic on 12/25/16.
 */
import {Component, Inject, AfterViewInit, OnDestroy} from "@angular/core";
import {WordStreamService} from "./word_stream.service";
import {WordPaintService} from "./word_paint.service";
import {Chance} from "chance";
import * as path from "path";

@Component({
  moduleId: path.relative(__dirname, __filename),
  selector: 'auto_paint_card',
  templateUrl: './_auto_paint_card.view.html',
  styleUrls: ['./_auto_paint_card.scss'],
  providers: [
    { provide: WordStreamService, useClass: WordStreamService },
    { provide: WordPaintService, useClass: WordPaintService, deps:[WordStreamService] }
  ]
})
export class AutoPaintCardComponent implements AfterViewInit, OnDestroy {
  private wordStreamService: WordStreamService;
  private chance;

  constructor(wordStreamService: WordStreamService, @Inject(Chance) chance) {
    this.wordStreamService = wordStreamService;
    this.chance = chance;
  }

  public ngAfterViewInit() {
    console.log('Auto paint card is at post-view init');
    this.doNextSubmit();
  }

  public ngOnDestroy() {
    // this.wordStreamService.endStream();
  }

  private doNextSubmit = () => {
    let nextPhrase = this.createNextPhrase();
    console.log('Auto paint card is submitting ' + nextPhrase)
    this.wordStreamService.submitNextTask(nextPhrase);
  };

  public onWordCompleted() {
    setTimeout(this.doNextSubmit, 5000);
  }

  private createNextPhrase(): string {
    let lenOne = this.chance.rpg('1d5')[0] + this.chance.rpg('1d3')[0] + 1;
    let lenTwo = this.chance.rpg('1d5')[0] + this.chance.rpg('1d3')[0] + 1;
    return this.chance.word({length: lenOne}) + ' ' + this.chance.word({length: lenTwo})
  }
}
