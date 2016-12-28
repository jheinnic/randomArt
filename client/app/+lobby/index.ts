/**
 * Created by jheinnic on 12/25/16.
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LobbyComponent } from './lobby.component';
import { AutoPaintCardComponent } from './auto_paint_card'
import { WordPaintComponent, WordPaintService } from './word_paint'
import { WordStreamService } from './word_stream';
import { routes } from './lobby.routes';

@NgModule({
  declarations: [ LobbyComponent, AutoPaintCardComponent, WordPaintComponent ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  providers       : [ WordStreamService, WordPaintService ],
})
export class LobbyModule {
  static routes = routes;
}

// export LobbyComponent;
