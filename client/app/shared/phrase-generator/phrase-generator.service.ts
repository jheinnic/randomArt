/**
 * Created by jheinnic on 1/7/17.
 */
import {Injectable} from "@angular/core";
import {Chance} from "chance";
import {Inject} from "@angular/core";

@Injectable()
export class PhraseGeneratorService {
  constructor( @Inject(Chance) private readonly chance ) {

  }
}
