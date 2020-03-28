import { Component } from '@angular/core';
import * as path from 'path';

@Component({
  moduleId: './app/+home/home-sidenav.component',
  selector: 'home',  // <home></home>
  styleUrls: [ './_home.component.scss' ],
  templateUrl: './_home-sidenav.component.html'
})
export class HomeSidenavComponent {
  private localState = {value: 11};

  constructor( ) { }
}
