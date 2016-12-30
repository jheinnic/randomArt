import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';

console.log('Home Routes Imported');

export const routes:Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'home', component: HomeComponent, pathMatch: 'full'}
];
