/**
 * Created by jheinnic on 12/25/16.
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {LobbyComponent} from "./lobby.component";
import {AutoPaintCardComponent} from "./auto_paint_card.component";
import {WordPaintComponent} from "./word_paint.component";
import {routes} from "./lobby.routes";

@NgModule({
  declarations: [LobbyComponent, AutoPaintCardComponent, WordPaintComponent],
  imports: [
    CommonModule,
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

export * from "./word_stream.service";
export * from "./word_paint.service";
export * from "./word_paint.component";
export * from "./auto_paint_card.component";
