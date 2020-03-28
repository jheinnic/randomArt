/**
 * Created by jheinnic on 1/17/17.
 */
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/concatMap';

let interval = Observable.interval(1000);
let result = interval.concatMap(x =>
  x % 2 === 1 ? Observable.of('a', 'b', 'c') : Observable.empty()
);
result.subscribe(x => console.log(x));
