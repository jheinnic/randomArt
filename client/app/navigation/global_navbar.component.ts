import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { LoginModal } from '../authentication';
import { LoopBackAuth, UserApi } from '../shared/sdk/services';
import { User } from '../shared/sdk/models';
import { LoopBackConfig } from '../shared/sdk';
import { BASE_URL, API_VERSION } from '../shared';
import * as path from "path";

const NO_USER_INFO:any = {id: undefined, firstName: undefined, lastName: undefined};

class NavbarData {
  brandName: string;

  constructor(brandName: string) {
    this.brandName = brandName;
  }
}

@Component({
  moduleId: path.relative(__dirname, __filename),
  selector: 'global_nav',
  templateUrl: './_global_navbar.view.html',
})
export class GlobalNavbar {
  private router:Router;
  private modalService: MdDialog;
  private loginModalRef:MdDialogRef<LoginModal>;
  private loopBackAuth:LoopBackAuth;
  private userApi:UserApi;

  // ViewModel
  private userInfo: User;
  private navbarData: NavbarData;

  constructor (router: Router, modalService:MdDialog, loopBackAuth: LoopBackAuth, userApi: UserApi) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);

    this.router = router;
    this.modalService = modalService;
    this.loopBackAuth = loopBackAuth;
    this.userApi = userApi;

    // this.userInfo = userInfo || this.NO_USER_INFO;
    this.userInfo = NO_USER_INFO;
    this.navbarData = new NavbarData('John Heinnickel');
  }

  onClickLogin() {
    this.loginModalRef = this.modalService.open(LoginModal, {
      disableClose: false
    });

    this.loginModalRef.afterClosed().subscribe(result => {
      console.log('result: ' + result);
      this.loginModalRef = undefined;
    });
  }

  /**
   * @param {object} event
   */
  public onSessionChangeEvent(event) {
    if (event.eventType.isAuthenticated()) {
      event.userInfo.then( function onUserInfoAvailable(data) {
        this.userInfo = data || this.NO_USER_INFO;
      }).catch(function onError(err) {
        this.userInfo = this.NO_USER_INFO;
        // console.error(err);
      });
    }
  }

  public isLogggedIn() {
    return this.userApi.isAuthenticated();
  }

  public logout() {
    this.userApi.logout();
  }

  // $scope.$on('jchptf.site.authentication.sessionChangeEvent', onSessionChangeEvent);
}

