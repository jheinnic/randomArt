/**
 * Created by jheinnic on 12/26/16.
 */
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

@Injectable()
export class WordStreamService {
  private taskStream:Subject<String> = new Subject<String>();

  constructor() {
  }

  public getTaskStream() : Observable<String> {
    if (this.taskStream == null) {
      throw new Error("The task stream has already been completed.  No more tasks remain.");
    }
    return this.taskStream.asObservable();
  }

  public submitNextTask( task: String ) {
    if (this.taskStream == null) {
      throw new Error("The task stream has already been completed.  No more tasks remain.");
    }
    this.taskStream.next(task);
  }

  public endStream() {
    if (this.taskStream == null) {
      throw new Error("The task stream has already been completed.  No more tasks remain.");
    }

    this.taskStream.complete();
    this.taskStream = null;
  }
}
