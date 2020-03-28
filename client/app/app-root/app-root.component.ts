import {
  Component, OnInit, AfterViewInit, QueryList, OnDestroy, ViewChildren, ViewChild
} from "@angular/core";
import {NavbarDataService} from "./navbar-data.service";
import {INavbarDataModelBuilder, NavbarData} from "./navbar-data.datamodel";
import {Subscription, Observable} from "rxjs";
import {LoopBackConfig} from "../shared/sdk/lb.config";
import {BASE_URL, API_VERSION} from "../shared/base-url.values";
import {MdSidenav} from "@angular/material";
import {GlobalSelection} from "../shared/component-util/global-selection.service";

@Component({
  moduleId: "app/app-root/app-root.component",
  selector: "app-root",
  template: require("./_app-root.view.html"),
  providers: [GlobalSelection]
  // providers: [NavbarDataResolver, NavbarDataService]
})
export class AppRootComponent implements OnInit, OnDestroy, AfterViewInit
{
  // @ViewChild("#sidenav") sideNav: MdSidenav|any = {
  // open: false,
  // closed: true,
  // isSideNavOpen: () => { return false; }
  // }

  @ViewChild(MdSidenav) private sideNavElem: MdSidenav;
  private navbarData: NavbarData;
  private subscription: Subscription;

  constructor(private readonly navbarDataService: NavbarDataService) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);

    this.subscription = this.navbarDataService.navbarData.subscribe(
      (data: NavbarData) => {
        if (data) {
          this.navbarData = data;
          if (this.sideNavElem) {
            if (data.sidenavOpen === true) {
              this.sideNavElem.open();
            } else {
              this.sideNavElem.close();
            }
          } else {
            console.warn('no visible sidenav controlers due to no internet')
          }
        }
      }
    );
  }

  ngOnInit() {
    this.navbarDataService.updateNavbar((builder: INavbarDataModelBuilder) => {
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
        .addTab('Create', '/pools', false)
        .addTab('Explore', '/scroll', false)
        .addTab('Inspect', '/pointMaps', false)
        .addTab('Manage', '/home', false)
        .addTab('Assess', '/pools/1/images', false)
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    // TODO
    if (this.sideNavElem) {
      let navbarData:Observable<NavbarData> =
        this.navbarDataService.navbarData;
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
    return (!!this.sideNavElem && this.sideNavElem.opened);
  }
}
