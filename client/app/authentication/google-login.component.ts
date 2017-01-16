/**
 * Created by jheinnic on 1/14/17.
 */
import {Component, Inject} from "@angular/core";
import {Location} from "@angular/common";
import { Router, ActivatedRoute } from '@angular/router';
import { LoopBackAuth } from '../shared/sdk/services';
import { SDKToken } from '../shared/sdk/models';
import { DIKeys } from '../shared/keys/keys.dictionary';
import path = require('path');

@Component({
  moduleId: path.resolve(__dirname, __filename),
  template: '&nbsp;'
})
export class GoogleLoginComponent {

  constructor(
    private readonly route: ActivatedRoute,
    private readonly location: Location,
    @Inject(DIKeys.googleLoginUrl) private googleLoginUrl:string
  ) {
    // this.location.go(this.googleLoginUrl);
    window.location.href = this.googleLoginUrl;
  }
}
