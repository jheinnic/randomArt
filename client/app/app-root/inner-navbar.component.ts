import {Component, OnDestroy, AfterViewInit} from "@angular/core";
import {NavbarDataService} from "./navbar-data.service";
import {NavbarData} from "./navbar-data.datamodel";
import {Subscription} from "rxjs/Subscription";

@Component({
  moduleId   : './app/app-root/app-root.component',
  selector   : 'inner-navbar',
  templateUrl: './_inner-navbar.view.html',
})
export class InnerNavbarComponent implements AfterViewInit, OnDestroy
{
  private navbarData: NavbarData = new NavbarData();
  private navbarSubscription: Subscription;
  private rlaSafe: boolean;

  constructor(private readonly navbarDataService: NavbarDataService) {
    this.navbarData = Object.assign(new NavbarData(), { brandName: 'placeholder' });
    this.navbarSubscription =
    this.navbarDataService.navbarData.subscribe(
      this.updateNavbarData, error => console.error(error),
      () => {this.navbarSubscription = undefined;} );
    this.rlaSafe = false;
  }

  updateNavbarData = (newData:NavbarData) => {
    // console.log("Navbar receives new data model: " + JSON.stringify(newData));
    this.navbarData = newData;
  };

  public ngAfterViewInit() {
    // https://github.com/angular/material2/issues/1967 workaround.  When routerLink is
    // dynamically bound, it is still an empty array by the time that isActive first starts
    // to check it.  Use setTimeout for nextTick as ngAfterViewInit is called after the
    // current tick's content check has already completed.
    setTimeout(() => {
      this.rlaSafe = true;
    }, 0);
  }

  public ngOnDestroy() {
    this.navbarSubscription.unsubscribe();
  }
}

