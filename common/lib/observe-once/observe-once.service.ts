/**
 * Created by jheinnic on 1/14/17.
 */
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable' ;

@Injectable()
export class ObserveOnceService {
  constructor() {}

  public observeOnce(target: Observable<any>): void {
    let subscription = target.subscribe((data:any) => {
        console.log('Data: ' + JSON.stringify(data));
        subscription.unsubscribe();
      }, (err) => {
        console.log('Error: ' + JSON.stringify(err));
        subscription.unsubscribe();
      }, () => {
        console.log('Done');
      }
    );
  }
}
