import {Component, OnInit} from "@angular/core";
import {AppState} from "./app.service";
import {LoopBackConfig} from "./shared/sdk";
import {BASE_URL, API_VERSION} from "./shared";

@Component({
  selector: "app-root",
  templateUrl: "./_app.rootView.html",
  styleUrls: ["./_app.scss"]
})
export class AppComponent implements OnInit
{
  private angularclassLogo: string = "assets/img/angularclass-avatar.png";
  private name: string = "Angular 2 Webpack Starter";
  private url: string = "https://twitter.com/AngularClass";
  public appState: AppState;

  public size: number = 640;
  public workUnit: number = 3;

  constructor(public _appState: AppState) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
    this.appState = _appState;
  }

  ngOnInit() {
    console.log("Initial App State", this.appState.state);
  }

  get(prop?: any) {
    if (this.hasOwnProperty(prop)) {
      return this[prop];
    }

    throw new Error("Unknown property: " + prop);
  }

  set(prop: string, value: any) {
    throw new Error("do not mutate the appState directly");
  }

}
