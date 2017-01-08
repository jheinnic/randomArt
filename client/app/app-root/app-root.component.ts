import {Component, OnInit} from "@angular/core";
import {NavbarDataService} from "../navigation/navbar-data.service";
import {NavbarDataModelBuilder} from "../navigation/navbar-data.datamodel";
import {BASE_URL, API_VERSION, LoopBackConfig} from "../shared";

@Component({
  selector: "app-root",
  template: require("./_app-root.view.html")
})
export class AppRootComponent implements OnInit {
  constructor(private navbarDataService: NavbarDataService ) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
  }

  ngOnInit() {
    this.navbarDataService.updateNavbar( (builder:NavbarDataModelBuilder) => {
      builder.brandName('John Heinnickel')
        .addTab('Home', '/home')
        .addTab('About', '/about')
        .addTab('Lobby', '/lobby')
        .addTab('Points', '/pointMaps')
        .addTab('Gallery', '/gallery')
        .addTab('Lobby', '/lobby');
    });
  }
}
