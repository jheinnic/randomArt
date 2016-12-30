import { Routes } from '@angular/router';
import { LobbyComponent } from './lobby.component';
import { NoContentComponent } from '../no-content';

console.log('Lobby rputes load');

export const routes:Routes = [
  {path: '', component: LobbyComponent, pathMatch: 'full'},
  {path: 'lobby', component: LobbyComponent, pathMatch: 'full'}
  // {path: '**',    component: NoContentComponent }
];
