"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/**
 * Created by jheinnic on 1/7/17.
 */
var core_1 = require("@angular/core");
var chance_1 = require("chance");
var core_2 = require("@angular/core");
var PhraseGeneratorService = (function () {
    function PhraseGeneratorService(chance) {
        this.chance = chance;
    }
    PhraseGeneratorService.prototype.createNextPhrase = function () {
        var lenOne = {
            length: this.chance.rpg('1d5')[0] + this.chance.rpg('1d3')[0] + 1
        };
        var lenTwo = {
            length: this.chance.rpg('1d5')[0] + this.chance.rpg('1d3')[0] + 1
        };
        return this.chance.word(lenOne) + " " + this.chance.word(lenTwo);
    };
    return PhraseGeneratorService;
}());
PhraseGeneratorService = __decorate([
    core_1.Injectable(),
    __param(0, core_2.Inject(chance_1.Chance))
], PhraseGeneratorService);
exports.PhraseGeneratorService = PhraseGeneratorService;
