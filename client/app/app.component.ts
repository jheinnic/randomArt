import { Component, OnInit } from '@angular/core';
import { LoopBackConfig } from './shared/sdk';
import { BASE_URL, API_VERSION } from './shared';

class Hero {
}

@Component({
  selector: 'app-root',
  templateUrl: './_app.rootView.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
 constructor() {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
  }

  title = 'Tour of Heroes';
  heroes: Hero[] = [];
  ngOnInit() {
    // getHeroes().then(heroes => this.heroes = heroes);
  }
}
