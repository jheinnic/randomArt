import {Component, OnInit, AfterViewInit, QueryList} from "@angular/core";
import {NavbarDataService} from "./navbar-data.service";
import {NavbarDataModelBuilder, NavbarData} from "./navbar-data.datamodel";
import {Subscription, Observable} from "rxjs";
import {LoopBackConfig} from "../shared/sdk/lb.config";
import {BASE_URL, API_VERSION} from "../shared/base-url.values";
import {MdSidenav} from "@angular/material";
import {GlobalSelection} from "../shared/component-util/global-selection.service";

@Component({
  selector: "app-root",
  template: require("./_app-root.view.html"),
  providers: [GlobalSelection]
  // providers: [NavbarDataResolver, NavbarDataService]
})
export class AppRootComponent implements OnInit, AfterViewInit
{
  // @ViewChild("#sidenav") sideNav: MdSidenav|any = {
  // open: false,
  // closed: true,
  // isSideNavOpen: () => { return false; }
  // }
  private sideNav: QueryList<MdSidenav>;
  private sideNavElem: MdSidenav;

  private subscription: Subscription;
  private navbarData: NavbarData;

  constructor(private navbarDataService: NavbarDataService) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
  }

  ngOnInit() {
    this.navbarDataService.updateNavbar((builder: NavbarDataModelBuilder) => {
      console.log("Creating Image Lab menu item");
      builder.brandName('JCH')
        .addMenuNav('Home', (builder) => {
          builder.routerLink('/home')
            .iconName('home')
            .orderRank(1)
        })
        .addMenuNav('Image Pools', (builder) => {
          builder.routerLink('/pools')
            .iconName('format_paint')
            .orderRank(2)
        })
        .addMenuNav('Events', (builder) => {
          builder.routerLink('/events')
            .disabled(false)
            .iconName('event')
            .orderRank(3)
        })
        .addTab('Create', '/images', false)
        .addTab('Explore', '/scroll', false)
        .addTab('Inspect', '/pointMaps', false)
        .addTab('Manage', '/home', false)
        .addTab('Assess', '/lobby', false)
    });
  }

  ngAfterViewInit() {
    let sideNavElem
    if (this.sideNav) {
      const sideNavArray: MdSidenav[] = this.sideNav.toArray();
      if (sideNavArray.length > 0) {
        let navbarData:Observable<NavbarData> =
          this.navbarDataService.navbarData;
        this.sideNavElem = sideNavArray[0];
        this.subscription = navbarData.subscribe(
          (data: NavbarData) => {
            if (data) {
              this.navbarData = data;
              if (sideNavElem) {
                if (data.sidenavOpen === true) {
                  sideNavElem.open();
                } else {
                  sideNavElem.close();
                }
              } else {
                console.warn('no visible sidenav controlers due to no internet')
              }
            }
          }
        );
      }
    }
  }

  public onActivate(anEvent: any) {
    console.log('On activate: ', anEvent);
  }

  public onDeactivate(anEvent: any) {
    console.log('On deactivate: ', anEvent);
  }

  public onSidenavOpened(event: any) {
    this.navbarDataService.updateNavbar((builder) => { builder.openSidenav() });
  }

  public onSidenavClosed(event: any) {
    this.navbarDataService.updateNavbar((builder) => { builder.closeSidenav() });
  }

  public isSideNavOpen() {
    return this.sideNav && this.sideNavElem && this.sideNavElem.opened;
  }
}
