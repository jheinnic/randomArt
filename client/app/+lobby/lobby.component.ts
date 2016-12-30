import { Component } from '@angular/core';
import { LoopBackConfig } from '../shared/sdk';
import { BASE_URL, API_VERSION } from '../shared';
import * as path from "path";

@Component({
  moduleId: path.relative(__dirname, __filename),
  selector: 'lobby',
  templateUrl: './_lobby.view.html',
  styleUrls: ['./_lobby.scss']
})
export class LobbyComponent {
 constructor() {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
  }
}
