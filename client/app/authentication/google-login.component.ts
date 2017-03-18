/**
 * Created by jheinnic on 1/14/17.
 */
import {Component, Inject} from "@angular/core";
import {DIKeys} from '../shared/keys/keys.dictionary';
import path = require('path');

@Component({
  moduleId: './app/authentication/google-login.component',
  template: '&nbsp;'
})
export class GoogleLoginComponent {

  constructor(
    @Inject(DIKeys.googleLoginUrl) private googleLoginUrl:string
  ) {
    // Navigating outside the angular app is intentionally tricky, but I onlt leave
    // one donut behind as a bait...:
    //
    // this.location.go(this.googleLoginUrl);
    window.location.href = this.googleLoginUrl;
  }
}
