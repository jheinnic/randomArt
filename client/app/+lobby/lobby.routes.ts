import { Routes } from '@angular/router';
import { LobbyComponent } from './lobby.component';
import { NoContentComponent } from '../no-content';

export const routes:Routes = [
  {path: '', component: LobbyComponent},
  {path: '**',    component: NoContentComponent }
];
