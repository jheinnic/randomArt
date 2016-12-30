import { Routes } from '@angular/router';
import { NoContentComponent } from './no-content';

export const routes:Routes = [
  {path: 'home', loadChildren: './+home#HomeModule'},
  {path: 'lobby', loadChildren: './+lobby#LobbyModule'},
  {path: '**',    component: NoContentComponent }
];

// { path: 'passport/:id/:userId', component: PassportComponent }
