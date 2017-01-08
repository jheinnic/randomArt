/**
 * Created by jheinnic on 12/25/16.
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {LobbyComponent} from "./lobby.component";
import {AutoPaintCardComponent} from "./auto-paint-card.component";
import {WordPaintComponent} from "./word-paint.component";

@NgModule({
  declarations: [LobbyComponent, AutoPaintCardComponent, WordPaintComponent],
  imports: [
    CommonModule, FormsModule, RouterModule.forChild(LobbyModule.routes)
  ],
  exports: [AutoPaintCardComponent]
})
export class LobbyModule
{
  static routes: Routes = [
    {
      path: '',
      component: LobbyComponent,
      pathMatch: 'full'
    },
    {
      path: 'lobby',
      component: LobbyComponent,
      pathMatch: 'full'
    }
  ];

  constructor() {
    console.log("Lobby Module Constructor Called");
  }
}

