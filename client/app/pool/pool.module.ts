/**
 * Created by jheinnic on 1/2/17.
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Routes, RouterModule} from "@angular/router";
import {ImageLobbyComponent} from "./image-lobby.component";
import {ImageLobbySideComponent} from "./image-lobby-side.component";
import {ImageLobbyActionComponent} from "./image-lobby-action.component";
import {NavbarDataResolver} from "../app-root/navbar-data.resolver";
import {
  MdChipsModule, MdCardModule, MdButtonModule, MdIconModule, MdProgressBarModule,
  MdTooltipModule, MdSidenavModule, MdInputModule, MdToolbarModule, MdCheckboxModule,
  MdTabsModule
} from "@angular/material";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [ImageLobbyComponent, ImageLobbySideComponent, ImageLobbyActionComponent],
  imports: [
    CommonModule,
    FormsModule,
    MdButtonModule,
    MdChipsModule,
    MdCardModule,
    MdCheckboxModule,
    MdIconModule,
    MdInputModule,
    MdSidenavModule,
    MdProgressBarModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
    NgbModule,
    // RouterModule.forChild(PoolModule.routes)
  ],
  exports: [ImageLobbyComponent, ImageLobbySideComponent, ImageLobbyActionComponent]
})
export class PoolModule
{
  /*
  static routes: Routes = [
    {
      path: 'images',
      component: ImageLobbyComponent,
      children: [
        {
          path: '',
          pathMatch: 'full',
          component: ImageLobbyComponent
        }, {
          path: '',
          pathMatch: 'full',
          outlet: 'side',
          component: ImageLobbySideComponent
        }, {
          path: '',
          pathMatch: 'full',
          outlet: 'action',
          component: ImageLobbyActionComponent,
          resolve: {
            navbarData: NavbarDataResolver
          }
        }
      ]
    }
  ];
*/

  constructor() {
  }
}
