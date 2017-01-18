/**
 * Created by jheinnic on 12/25/16.
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {MdCardModule, MdInputModule, MdButtonModule} from "@angular/material";
import {HomeMainComponent} from "./home-main.component";
import {HomeSidenavComponent} from "./home-sidenav.component";
import {NgZoneDemoComponent} from "./ng-zone-demo/ng-zone-demo.component";
import {Title} from "./title";
import {XLarge} from "./x-large";
import {routes} from "./home.routes";

@NgModule({
  declarations: [HomeMainComponent, HomeSidenavComponent, NgZoneDemoComponent, XLarge],
  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), MdButtonModule, MdCardModule, MdInputModule
  ],
  providers: [Title],
  exports: [RouterModule, XLarge, NgZoneDemoComponent]
})
export class HomeModule
{
  static routes = routes;

  constructor() {
    console.log('Home Loads');
  }
}
