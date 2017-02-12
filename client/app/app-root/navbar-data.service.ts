/**
 * Created by jheinnic on 12/31/16.
 */
import {Injectable} from "@angular/core";
import {NavbarData, NavbarDataDirector, NavbarDataModelBuilder} from "./navbar-data.datamodel";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class NavbarDataService {
  private dataModel = new NavbarData();
  private dataSubject = new ReplaySubject<NavbarData>(1);

  get navbarData(): Observable<NavbarData> {
    return this.dataSubject.asObservable();
  }

  public updateNavbar(director: NavbarDataDirector) {
    this.dataModel = this.dataModel.copy(director);
    this.dataSubject.next(this.dataModel);
  }
}
