/**
 * Created by jheinnic on 1/17/17.
 */
import {Component, OnDestroy} from "@angular/core";
import {Subscription} from "rxjs";
import {NavbarData} from "../app-root/navbar-data.datamodel";
import {NavbarDataService} from "../app-root/navbar-data.service";

@Component({
  moduleId: './app/scroll/scroll-action.component',
  templateUrl: './_scroll-action.view.html'
})
export class ScrollActionComponent implements OnDestroy {
  private willPaint: boolean = true;
  private isPainting: boolean = false;

  private subscription: Subscription;
  private navbarData: NavbarData;

  constructor(private readonly navbarDataService: NavbarDataService) {
    this.subscription = this.navbarDataService.navbarData.subscribe((data:NavbarData) => {
      this.navbarData = data;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get sidenavOpen() {
    return this.navbarData.sidenavOpen;
  }

  openSidenav() {
    this.navbarDataService.updateNavbar((builder) => {
      builder.openSidenav();
    });
  }

  beginPainting() {
    this.willPaint = false;
    this.isPainting = true;
  }

  scheduleNext() {
    this.willPaint = true;
    this.isPainting = false;
  }
}
