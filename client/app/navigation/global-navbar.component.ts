import {Component, OnInit, OnDestroy, AfterViewInit} from "@angular/core";
import {MdDialog, MdDialogRef} from "@angular/material";
import {LoginModalComponent} from "../authentication";
import {NavbarDataService} from "./navbar-data.service";
import {NavbarData, NavbarTabData} from "./navbar-data.datamodel";
import {UserInterface} from "../shared/sdk/models";
import {UserApi} from "../shared/sdk/services";
import {LoopBackConfig} from "../shared/sdk";
import {BASE_URL, API_VERSION} from "../shared";
import {Subscription} from "rxjs/Subscription";
import * as path from "path";

const NO_USER_INFO: UserInterface = {
  id: undefined, username: 'anonymous', password: undefined, email: undefined
};

@Component(
  {
    moduleId   : path.relative(__dirname, __filename),
    selector   : 'global-navbar',
    templateUrl: './_global-navbar.view.html',
  }
)
export class GlobalNavbarComponent implements AfterViewInit, OnDestroy
{
  private userInfo: UserInterface;
  private loginModalRef: MdDialogRef<LoginModalComponent>;

  private navbarData: NavbarData = new NavbarData();
  private navbarSubscription: Subscription;
  private rlaSafe: boolean;

  constructor(
    private navbarDataService: NavbarDataService, private modalService: MdDialog, private userApi: UserApi
  ) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
    this.userInfo = NO_USER_INFO;
    // this.navbarData = this.navbarDataService.navbarData;
    this.navbarData = Object.assign(new NavbarData(), { brandName: 'placeholder' });
    this.navbarSubscription =
      this.navbarDataService.navbarData.subscribe(this.updateNavbarData);
    this.rlaSafe = false;
  }

  updateNavbarData = (newData: NavbarData) => {
    console.log("Navbar receives new data model: " + JSON.stringify(newData));
    this.navbarData = newData;
  }

  public ngAfterViewInit() {
    // https://github.com/angular/material2/issues/1967 workaround.  When routerLink is
    // dynamically bound, it is still an empty array by the time that isActive first starts
    // to check it.
    this.rlaSafe = true;
  }

  public ngOnDestroy() {
    this.navbarSubscription.unsubscribe();
  }

  public onClickLogin() {
    this.loginModalRef = this.modalService.open(
      LoginModalComponent, { disableClose: false } );

    this.loginModalRef.afterClosed()
      .subscribe(
        result => {
          console.log('result: ' + result);
          this.loginModalRef = undefined;
          if (result.userInfo) {
            this.userInfo = result.userInfo;
          }
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

  public isLoggedIn() {
    return this.userApi.isAuthenticated();
  }

  public logout() {
    this.userApi.logout();
  }

  // $scope.$on('jchptf.site.authentication.sessionChangeEvent', onSessionChangeEvent);
}

