/**
 * Created by jheinnic on 12/31/16.
 */
import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { NavbarDataService } from "./navbar-data.service";
import { NavbarData } from "./navbar-data.datamodel";
import { Observable } from "rxjs/Observable";

@Injectable()
class NavbarDataResolver implements Resolve<NavbarData>
{
  constructor(private dataService: NavbarDataService) {}

  resolve(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): Observable<NavbarData> {
    return this.dataService.navbarData;
  }
}
