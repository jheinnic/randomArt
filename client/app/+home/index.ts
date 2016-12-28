/**
 * Created by jheinnic on 12/25/16.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { Title } from './title';
import { XLarge } from './x-large';
import { routes } from './home.routes';

@NgModule({
  declarations: [ HomeComponent, XLarge ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [ {provide: Title, useClass: Title} ],
  exports: [ XLarge ]
})
export class HomeModule {
  static routes = routes;
}

// export HomeComponent;
