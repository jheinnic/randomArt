/**
 * Created by jheinnic on 12/25/16.
 */
import {Component, Inject, ViewChild, AfterViewInit} from "@angular/core";
import {WordPaintService} from "./word-paint.service";
import {WordPaintComponent} from "./word-paint.component";
import {Chance} from "chance";
import * as path from "path";
import _ = require('lodash');

@Component({
  moduleId: path.relative(__dirname, __filename),
  selector: 'autoPaintCard',
  templateUrl: './_auto-paint-card.view.html',
  providers: [ WordPaintService ]
})
export class AutoPaintCardComponent implements AfterViewInit {
  private _size:number = 360;
  private _workUnit: number = 10;
  private chance;
  private subscription;
  @ViewChild("myCanvas") wordPaintComponent: WordPaintComponent;

  get size(): number { return this._size; }

  set size(value: number) {
    this._size = value;
    if (_.isObject(this.wordPaintComponent)) {
      this.wordPaintComponent.size = value;
      console.log("Auto word component was sent size");
    }
  }

  get workUnit(): number { return this._workUnit; }

  set workUnit(value: number) {
    this._workUnit = value;

    if (_.isObject(this.wordPaintComponent)) {
      this.wordPaintComponent.workUnit = value;
      console.log("Auto word component was sent workUnit");
    }
  }

  constructor(
    private wordPaintService: WordPaintService, @Inject(Chance) chance
  ) {
    this.chance = chance;
  }

  private doNextSubmit = () => {
    let nextPhrase = this.createNextPhrase();
    console.log('Auto paint card is submitting ' + nextPhrase)
    this.wordPaintService.submitNextTask(nextPhrase);
  };

  public ngAfterViewInit() {
    this.wordPaintComponent.size = this._size;
    this.wordPaintComponent.workUnit = this._workUnit;
    console.log("Auto word component was sent size and workUnit");
  }

  public onCanvasReady() {
    console.log("Auto word component was signalled onCanvasReady from wordPaint");
    setTimeout(this.doNextSubmit, 5000);
  }

  public onWordCompleted() {
    console.log("Auto word component was signalled onWordComplete from wordPaint");
    setTimeout(() => { this.wordPaintService.confirmDone(); }, 5000);
    console.log("Service should receive the confirmation its waiting for within 5 seconds.");
  }

  private createNextPhrase(): string {
    let lenOne = this.chance.rpg('1d5')[0] + this.chance.rpg('1d3')[0] + 1;
    let lenTwo = this.chance.rpg('1d5')[0] + this.chance.rpg('1d3')[0] + 1;
    return this.chance.word({length: lenOne}) + ' ' + this.chance.word({length: lenTwo})
  }
}
