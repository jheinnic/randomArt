import {Component, OnInit} from "@angular/core";
import {NavbarDataService} from "./navbar-data.service";
import {NavbarDataModelBuilder} from "./navbar-data.datamodel";
import {BASE_URL, API_VERSION, LoopBackConfig} from "../shared";
import {NavbarDataResolver} from "./navbar-data.resolver";

@Component({
  selector: "app-root",
  template: require("./_app-root.view.html"),
  // providers: [NavbarDataResolver, NavbarDataService]
})
export class AppRootComponent implements OnInit {
  private hasNavbar = false;

  constructor(private navbarDataService: NavbarDataService ) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
  }

  ngOnInit() {
    this.navbarDataService.updateNavbar( (builder:NavbarDataModelBuilder) => {
      builder.brandName('JCH')
        .addMenuNav('Home', (builder) => {
          builder.routerLink('/home')
            .iconName('home')
            .orderRank(1)
        })
        .addMenuNav('Images', (builder) => {
          builder.routerLink('/lobby')
            .iconName('pictures')
            .orderRank(2)
        })
        .addMenuNav('Speed Dating', (builder) => {
          builder.routerLink('/about')
            .disabled(true)
            .orderRank(3)
        })
        .addTab('Create', '/images', false)
        .addTab('Explore', '/scroll', false)
        .addTab('Inspect', '/pointMaps', false)
        .addTab('Manage', '/home', false)
        .addTab('Assess', '/lobby', false)
    });
  }

  public onNavbarChange(hasNavbar: boolean) {
    this.hasNavbar = hasNavbar;
  }

  public onActivate(event) {
    console.log('On activate: ', event );
  }

  public onDeactivate(event) {
    console.log('On deactivate: ', event );
  }
}
