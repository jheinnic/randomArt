/**
 * Created by jheinnic on 1/6/17.
 */
import {Component} from "@angular/core"
import {MdDialogRef} from "@angular/material";
import {PhraseGeneratorService} from "./phrase-generator.service";
import {WordPaintInput} from "../../pool/word-paint-input.datamodel";
import {FluentAdapter} from "../../../../common/lib/datamodel-ts/index";
import path = require('path');

@Component({
  moduleId: path.resolve(__dirname, __filename),
  selector: 'new-named-canvas-modal',
  template: require('./_new-named-canvas-modal.view.html')
})
export class NewNamedCanvasModalComponent {
  private wordPaintInput: WordPaintInput

  constructor(
    private readonly modalRef: MdDialogRef<NewNamedCanvasModalComponent>,
    private readonly phraseGenerator: PhraseGeneratorService
  ) {
    this.wordPaintInput = WordPaintInput.build(
      (builder:FluentAdapter<WordPaintInput>) => {
        builder.phrase(
          this.phraseGenerator.createNextPhrase()
        )
          // .width(640)
          // .height(480);
      }
    );
  }

  private generateNewPhrase() {
    // this.wordPaintInput = this.wordPaintInput.copy(
    //   (builder: WordPaintInputBuilder) => {
    //     builder.phrase(this.phraseGenerator.createNextPhrase());
    //   });
  }

  get phraseToPaint():string {
    return this.wordPaintInput.phrase;
  }

  set phraseToPaint(value: string) {
    // this.wordPaintInput = this.wordPaintInput.copy(
    //   (builder: WordPaintInputBuilder) => { builder.phrase(value); }
    // );
  }

  // get width(): number {
  //   return this.wordPaintInput.width;
  // }
  //
  // set width(value:number) {
  //   this.wordPaintInput = this.wordPaintInput.copy(
  //     (builder: WordPaintInputBuilder) => {
  //       builder.width(value);
  //     }
  //   );
  // }
  //
  // get height(): number {
  //   return this.wordPaintInput.height;
  // }
  //
  // set height(value:number) {
  //   this.wordPaintInput = this.wordPaintInput.copy(
  //     (builder: WordPaintInputBuilder) => {
  //       builder.height(value);
  //     }
  //   );
  // }

  // This close function doesn't need to use jQuery or bootstrap, because
  // the button has the 'data-dismiss' attribute.
  ok() {
    this.modalRef.close(this.wordPaintInput);
  }
}
