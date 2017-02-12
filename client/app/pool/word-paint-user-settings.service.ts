/**
 * Created by jheinnic on 1/29/17.
 */
import {Injectable} from "@angular/core";
import {AsyncLocalStorage} from "angular-async-local-storage";

@Injectable()
export class WordPaintUserSettingsService {
  constructor(private readonly localStorage: AsyncLocalStorage) {

  }

}
