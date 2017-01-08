/**
 * Created by jheinnic on 1/6/17.
 */
import {Component, Inject} from "@angular/core"
import {MdDialogRef} from "@angular/material";
import {Chance} from "chance";
import path = require('path');
import {WordPaintTaskData, WordPaintTaskDataBuilder} from "./word-paint-task.datamodel";

@Component({
  moduleId: path.resolve(__dirname, __filename),
  selector: 'new-named-canvas-modal',
  template: require('./_new-named-canvas-modal.view.html')
})
export class NewNamedCanvasModalComponent {
  private wordPaintTask: WordPaintTaskData

  constructor(
    private readonly modalRef: MdDialogRef<NewNamedCanvasModalComponent>,
    @Inject(Chance) private readonly chance
  ) {
    this.wordPaintTask = WordPaintTaskData.build((builder:WordPaintTaskDataBuilder) => {
      builder.phraseToPaint(this.createNextPhrase())
        .width(640)
        .height(480);
    });
    this.createNextPhrase();
  }

  private createNextPhrase() {
    let lenOne = this.chance.rpg('1d5')[0] + this.chance.rpg('1d3')[0] + 1;
    let lenTwo = this.chance.rpg('1d5')[0] + this.chance.rpg('1d3')[0] + 1;
    let retVal =
      this.chance.word(
        {length: lenOne}
      ) + ' ' + this.chance.word(
        {length: lenTwo}
      );

    return retVal;
  }

  private generateNewPhrase() {
    this.wordPaintTask = this.wordPaintTask.copy((builder: WordPaintTaskDataBuilder) => {
      builder.phraseToPaint(this.createNextPhrase());
    });
  }

  get phraseToPaint():string {
    return this.wordPaintTask.phraseToPaint;
  }

  get width(): number {
    return this.wordPaintTask.width;
  }

  set width(value:number) {
    this.wordPaintTask = this.wordPaintTask.copy((builder: WordPaintTaskDataBuilder) => {
      builder.width(value);
    })
  }

  get height(): number {
    return this.wordPaintTask.height;
  }

  set height(value:number) {
    this.wordPaintTask = this.wordPaintTask.copy((builder: WordPaintTaskDataBuilder) => {
      builder.height(value);
    })
  }

  // This close function doesn't need to use jQuery or bootstrap, because
  // the button has the 'data-dismiss' attribute.
  ok() {
    this.modalRef.close(this.wordPaintTask);
  }
}
