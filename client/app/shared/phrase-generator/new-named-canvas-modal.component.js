"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by jheinnic on 1/6/17.
 */
var core_1 = require("@angular/core");
var word_paint_input_datamodel_1 = require("../../pool/word-paint-input.datamodel");
var path = require("path");
var NewNamedCanvasModalComponent = (function () {
    function NewNamedCanvasModalComponent(modalRef, phraseGenerator) {
        var _this = this;
        this.modalRef = modalRef;
        this.phraseGenerator = phraseGenerator;
        this.wordPaintInput = word_paint_input_datamodel_1.WordPaintInput.build(function (builder) {
            builder.phrase(_this.phraseGenerator.createNextPhrase());
            // .width(640)
            // .height(480);
        });
    }
    NewNamedCanvasModalComponent.prototype.generateNewPhrase = function () {
        // this.wordPaintInput = this.wordPaintInput.copy(
        //   (builder: WordPaintInputBuilder) => {
        //     builder.phrase(this.phraseGenerator.createNextPhrase());
        //   });
    };
    Object.defineProperty(NewNamedCanvasModalComponent.prototype, "phraseToPaint", {
        get: function () {
            return this.wordPaintInput.phrase;
        },
        set: function (value) {
            // this.wordPaintInput = this.wordPaintInput.copy(
            //   (builder: WordPaintInputBuilder) => { builder.phrase(value); }
            // );
        },
        enumerable: true,
        configurable: true
    });
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
    NewNamedCanvasModalComponent.prototype.ok = function () {
        this.modalRef.close(this.wordPaintInput);
    };
    return NewNamedCanvasModalComponent;
}());
NewNamedCanvasModalComponent = __decorate([
    core_1.Component({
        moduleId: path.resolve(__dirname, __filename),
        selector: 'new-named-canvas-modal',
        template: require('./_new-named-canvas-modal.view.html')
    })
], NewNamedCanvasModalComponent);
exports.NewNamedCanvasModalComponent = NewNamedCanvasModalComponent;
