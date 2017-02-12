/**
 * Created by jheinnic on 1/6/17.
 */
import {Component, Inject} from "@angular/core"
import {MdDialogRef} from "@angular/material";
import path = require('path');
import {PhraseGeneratorService} from "./phrase-generator.service";
import {WordPaintTask, WordPaintTaskBuilder} from "../../pool/word-paint-task.datamodel";

@Component({
  moduleId: path.resolve(__dirname, __filename),
  selector: 'new-named-canvas-modal',
  template: require('./_new-named-canvas-modal.view.html')
})
export class NewNamedCanvasModalComponent {
  private wordPaintTask: WordPaintTask

  constructor(
    private readonly modalRef: MdDialogRef<NewNamedCanvasModalComponent>,
    private readonly phraseGenerator: PhraseGeneratorService
  ) {
    this.wordPaintTask = WordPaintTask.build((builder:WordPaintTaskBuilder) => {
      builder.phrase(
        this.phraseGenerator.createNextPhrase()
      )
        // .width(640)
        // .height(480);
    });
  }

  private generateNewPhrase() {
    // this.wordPaintTask = this.wordPaintTask.copy(
    //   (builder: WordPaintTaskBuilder) => {
    //     builder.phrase(this.phraseGenerator.createNextPhrase());
    //   });
  }

  get phraseToPaint():string {
    return this.wordPaintTask.phrase;
  }

  set phraseToPaint(value: string) {
    // this.wordPaintTask = this.wordPaintTask.copy(
    //   (builder: WordPaintTaskBuilder) => { builder.phrase(value); }
    // );
  }

  // get width(): number {
  //   return this.wordPaintTask.width;
  // }
  //
  // set width(value:number) {
  //   this.wordPaintTask = this.wordPaintTask.copy(
  //     (builder: WordPaintTaskBuilder) => {
  //       builder.width(value);
  //     }
  //   );
  // }
  //
  // get height(): number {
  //   return this.wordPaintTask.height;
  // }
  //
  // set height(value:number) {
  //   this.wordPaintTask = this.wordPaintTask.copy(
  //     (builder: WordPaintTaskBuilder) => {
  //       builder.height(value);
  //     }
  //   );
  // }

  // This close function doesn't need to use jQuery or bootstrap, because
  // the button has the 'data-dismiss' attribute.
  ok() {
    this.modalRef.close(this.wordPaintTask);
  }
}
