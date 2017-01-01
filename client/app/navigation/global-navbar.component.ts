import {Component, OnInit, OnDestroy} from "@angular/core";
import {Router} from "@angular/router";
import {MdDialog, MdDialogRef} from "@angular/material";
import {LoginModal} from "../authentication";
import {NavbarDataService} from "./navbar-data.service";
import {UserInterface} from "../shared/sdk/models";
import {UserApi} from "../shared/sdk/services";
import {LoopBackConfig} from "../shared/sdk";
import {BASE_URL, API_VERSION} from "../shared";
import {Subscription} from "rxjs/Subscription";
import * as path from "path";

const NO_USER_INFO: UserInterface = {
  id: undefined, username: 'anonymous', password: undefined, email: undefined
};

class NavbarData
{
  brandName: string;

  constructor(brandName: string) {
    this.brandName = brandName;
  }
}

@Component(
  {
    moduleId   : path.relative(__dirname, __filename),
    selector   : 'globalNav',
    templateUrl: './_global-navbar.view.html',
  }
)
export class GlobalNavbar implements OnInit, OnDestroy
{
  private userInfo: UserInterface;
  private loginModalRef: MdDialogRef<LoginModal>;

  private navbarData: NavbarData;
  private navbarSubscription: Subscription;

  constructor(
    private navbarDataService: NavbarDataService, private router: Router,
    private modalService: MdDialog, /*loopBackAuth: LoopBackAuth,*/ private userApi: UserApi
  ) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
    this.userInfo = NO_USER_INFO;
  }

  public ngOnInit() {
    this.navbarSubscription =
      this.navbarDataService.navbarData.subscribe(this.updateNavbarData);
  }

  private updateNavbarData(newData: NavbarData) {
    this.navbarData = newData;
  }

  public ngOnDestroy() {
    this.navbarSubscription.unsubscribe();
  }

  public onClickLogin() {
    this.loginModalRef = this.modalService.open(
      LoginModal, {
        disableClose: false
      }
    );

    this.loginModalRef.afterClosed()
      .subscribe(
        result => {
          console.log('result: ' + result);
          this.loginModalRef = undefined;
        }
      );
  }

  /**
   * @param {object} event
   */
  public onSessionChangeEvent(event) {
    if (event.eventType.isAuthenticated()) {
      event.userInfo.then(
        function onUserInfoAvailable(data) {
          this.userInfo = data || this.NO_USER_INFO;
        }
      )
        .catch(
          function onError(err) {
            this.userInfo = this.NO_USER_INFO;
            // console.error(err);
          }
        );
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

