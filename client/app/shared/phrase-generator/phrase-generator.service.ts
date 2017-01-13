/**
 * Created by jheinnic on 1/7/17.
 */
import {Injectable} from "@angular/core";
import {Chance} from "chance";
import {Inject} from "@angular/core";

@Injectable()
export class PhraseGeneratorService {
  constructor( @Inject(Chance) private readonly chance ) { }

  public createNextPhrase() {
    let lenOne = {
      length: this.chance.rpg('1d5')[0] + this.chance.rpg('1d3')[0] + 1
    };
    let lenTwo = {
      length: this.chance.rpg('1d5')[0] + this.chance.rpg('1d3')[0] + 1
    };

    return `${this.chance.word(lenOne)} ${this.chance.word(lenTwo)}`;
  }
}
