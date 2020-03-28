import {Component, OnInit} from '@angular/core';
import { Title } from './title';
// import { XLarge } from './x-large';
import * as path from 'path';

@Component({
  moduleId: './app/+home/home-main.compoment',
  selector: 'home',  // <home></home>
  styleUrls: [ './_home.component.scss' ],
  templateUrl: './_home-main.component.html'
})
export class HomeMainComponent implements OnInit
{
  // Set our default values
  localState = { value: '' };

  // TypeScript public modifiers
  constructor(public readonly title: Title) { }

  ngOnInit() {
    console.log('hello `Home` component');
    // this.title.getData().subscribe(data => this.data = data);
  }

  submitState(value: string) {
    console.log('submitState', value);
    this.localState.value = '';
  }
}
