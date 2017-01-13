/**
 * Created by jheinnic on 1/2/17.
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Routes, RouterModule} from "@angular/router";
import {ImageLobbyComponent} from "./image-lobby.component";
import {
  MdChipsModule, MdGridList, MdCardModule, MdButtonModule, MdIconModule, MdProgressBarModule,
  MdTooltipModule, MdDialogModule, MdGridListModule, MdSidenavModule, MdInputModule,
  MdToolbarModule, MdCheckboxModule, MdTabsModule
} from "@angular/material";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [ImageLobbyComponent],
  imports: [
    CommonModule,
    FormsModule,
    MdChipsModule,
    MdCardModule,
    MdCheckboxModule,
    MdButtonModule,
    MdIconModule,
    MdInputModule,
    MdSidenavModule,
    MdProgressBarModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
    NgbModule,
    RouterModule.forChild(PoolModule.routes)
  ],
  exports: [ImageLobbyComponent]
})
export class PoolModule
{
  static routes: Routes = [
    {
      path: '',
      component: ImageLobbyComponent,
      pathMatch: 'full'
    }, {
      path: 'lobby',
      component: ImageLobbyComponent,
      pathMatch: 'full'
    }
  ];

  constructor() {
  }
}
