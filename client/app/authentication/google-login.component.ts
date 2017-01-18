/**
 * Created by jheinnic on 1/14/17.
 */
import {Component, Inject} from "@angular/core";
import { DIKeys } from '../shared/keys/keys.dictionary';
import path = require('path');

@Component({
  moduleId: './app/authentication/google-login.component',
  template: '&nbsp;'
})
export class GoogleLoginComponent {

  constructor(
    @Inject(DIKeys.googleLoginUrl) private googleLoginUrl:string
  ) {
    // this.location.go(this.googleLoginUrl);
    window.location.href = this.googleLoginUrl;
  }
}
