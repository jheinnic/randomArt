/**
 * Created by jheinnic on 12/25/16.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { Title } from './title';
import { XLarge } from './x-large';
import { NgZoneDemo } from './ng-zone-demo';
import { routes } from './home.routes';

@NgModule({
  declarations: [ HomeComponent, NgZoneDemo, XLarge ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  providers: [ Title ],
  exports: [ XLarge, NgZoneDemo ]
})
export class HomeModule {
  static routes = routes;
  constructor() {
    console.log('Home Loads');
  }
}

// export HomeComponent;
export * from './title';
export * from './x-large';
export * from './ng-zone-demo';
export * from './home.component';
