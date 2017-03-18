/**
 * Created by jheinnic on 2/5/17.
 */
import {OnDestroy} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

export abstract class AbstractSelection<T> implements OnDestroy {
  private selection: BehaviorSubject<T>;
  private isSelected: T;

  constructor() {
    this.selection = new BehaviorSubject<T>(undefined);
  }

  public set selected(newTarget: T) {
    if (! newTarget) {
      throw new Error("Use clear() to purge a selection, not null or undefined.);")
    }

    if (this.isSelected !== newTarget) {
      this.isSelected = newTarget;
      this.selection.next(newTarget);
    }
  }

  public get selected(): T {
    return this.isSelected;
  }

  public hasSelection(): boolean {
    return !!this.isSelected;
  }

  public onSelect(): Observable<T> {
    return this.selection.asObservable();
  }

  public clear(): void {
    this.isSelected = undefined;
    this.selection.next(undefined);
  }

  public ngOnDestroy() {
    this.isSelected = undefined;
    this.selection.complete();
  }
}
