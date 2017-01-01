/**
 * Created by jheinnic on 12/25/16.
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {LobbyComponent} from "./lobby.component";
import {AutoPaintCardComponent} from "./auto-paint-card.component";
import {WordPaintComponent} from "./word-paint.component";
import {routes} from "./lobby.routes";

@NgModule({
  declarations: [LobbyComponent, AutoPaintCardComponent, WordPaintComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [AutoPaintCardComponent]
})
export class LobbyModule {
  static routes = routes;

  constructor() {
    console.log("Lobby Module Constructor Called");
  }
}

export * from "./word-paint.service";
export * from "./word-paint.component";
export * from "./auto-paint-card.component";
