/**
 * Created by jheinnic on 2/5/17.
 */
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

export abstract class AbstractSelection<T> {
  private selection: Subject<T>;
  private isSelected: T;

  constructor() {
    this.selection = new Subject<T>();
  }

  public set selected(newTarget: T) {
    this.isSelected = newTarget;
    this.selection.next(newTarget);
  }

  public get selected(): T {
    return this.isSelected;
  }

  public observeSelection(): Observable<T> {
    return this.selection.asObservable();
  }

  public clearSelection(): void {
    this.isSelected = undefined;
    this.selection.next(undefined);
  }

  public onDestroy() {
    this.isSelected = undefined;
    this.selection.next(undefined);
    this.selection.complete();
  }
}
