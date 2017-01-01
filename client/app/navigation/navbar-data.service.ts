/**
 * Created by jheinnic on 12/31/16.
 */
import {Injectable} from "@angular/core";
import {NavbarData, NavbarDataDirector, NavbarDataModelBuilder} from "./navbar-data.datamodel";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Observable} from "rxjs/Observable";

require("rxjs/add/operator/share");

@Injectable()
export class NavbarDataService {
  private dataModel = new NavbarData();
  private dataSubject = new ReplaySubject<NavbarData>(1);
  private observableData = this.dataSubject.asObservable().share();

  get navbarData(): Observable<NavbarData> {
    return this.observableData;
  }

  public updateNavbar(director: NavbarDataDirector) {
    this.dataSubject.next(
      this.dataModel.copy(director)
    );
  }
}
