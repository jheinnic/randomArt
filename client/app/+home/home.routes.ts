import { Routes } from '@angular/router';
import { HomeMainComponent } from './home-main.component';
import { HomeSidenavComponent } from './home-sidenav.component';
import { NgZoneDemoComponent } from './ng-zone-demo/ng-zone-demo.component';

console.log('Home Routes Imported');

export const routes:Routes = [
  {path: '', pathMatch: 'full', component: HomeMainComponent },
  {path: '', pathMatch: 'full', outlet: 'side', component: HomeSidenavComponent },
  {path: 'zone', children: [
    {path: '', pathMatch: 'full', component: NgZoneDemoComponent },
    {path: '', pathMatch: 'full', outlet: 'side', component: HomeMainComponent }
  ]}
];
