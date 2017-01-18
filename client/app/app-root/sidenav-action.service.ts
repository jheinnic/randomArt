/**
 * Created by jheinnic on 1/17/17.
 */
import {Input, EventEmitter, Output, Directive, Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class SidenavActionService {
  private isOpenedValue = false;
  private isOpenedSubject = new BehaviorSubject(false);

  public isOpened() {
    return this.isOpenedSubject.asObservable();
  }

  public open() {
    this.isOpenedValue = true;
    this.isOpenedSubject.next(true);
  }

  public close() {
    this.isOpenedValue = false;
    this.isOpenedSubject.next(false);
  }

  public toggle() {
    this.isOpenedValue = !this.isOpenedValue;
    this.isOpenedSubject.next(this.isOpenedValue);
    return this.isOpenedValue;
  }
}
