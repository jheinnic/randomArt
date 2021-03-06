/**
 * Created by jheinnic on 12/25/16.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SeedConnectResolver} from './seed-connect.resolver';
import {SeedComponent} from "./seed.component";

@NgModule({
  declarations: [ SeedComponent ],
  imports: [
    CommonModule,
    RouterModule.forChild(PeernetModule.routes)
  ],
  providers: [ ],
  exports: [ ]
})
export class PeernetModule {
  static routes:Routes = [
    {path: 'seeds/:seedId', component: SeedComponent, pathMatch: 'full', resolve: {
      gossipmonger: SeedConnectResolver
    }}
  ];
  constructor() {
    console.log('PeerNet Loads');
  }
}

