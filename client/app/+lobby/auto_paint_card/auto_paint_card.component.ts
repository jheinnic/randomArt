/**
 * Created by jheinnic on 12/25/16.
 */
import {Component} from '@angular/core';
import {WordPaintComponent} from '../word_paint';
import {WordStreamService} from '../word_stream';
import {Chance} from 'chance';
import * as path from "path";

@Component({
  moduleId: path.relative(__dirname, __filename),
  selector: 'auto_paint_card',
  templateUrl: './_auto_paint_card.view.html',
  styleUrls: ['./_auto_paint_card.scss'],
  providers: [WordStreamService]
})
export class AutoPaintCardComponent {
  private wordPaintComponent:WordPaintComponent;
  private wordStreamService:WordStreamService;
  private chance = Chance();

  constructor(wordPaintComponent: WordPaintComponent, wordStreamService:WordStreamService) {
    this.wordPaintComponent = wordPaintComponent;
    this.wordStreamService = wordStreamService;

    this.onWordCompleted();
  }

  public onWordCompleted() {
    setTimeout( function() {
      this.wordStreamService.submitNextTask(
        this.createNextPhrase()
      )
    }, 10);
  }

  private createNextPhrase() : string {
    let lenOne = this.chance.rpg('1d5')[0] + this.chance.rpg('1d3')[0] + 1;
    let lenTwo = this.chance.rpg('1d5')[0] + this.chance.rpg('1d3')[0] + 1;
    return this.chance.word({length: lenOne}) + ' ' + this.chance.word({length:lenTwo})
  }
}
