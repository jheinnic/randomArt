import {Component, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter} from "@angular/core";
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
  username: 'anonymous', password: undefined, email: undefined
};

@Component({
  moduleId   : path.relative(__dirname, __filename),
  selector   : 'top-toolbar',
  host: {
    '[class.control-theme]': 'true'
  },
  templateUrl: './_top-toolbar.view.html',
})
export class TopToolbarComponent implements OnDestroy
{
  private userInfo: UserInterface;
  private loginModalRef?: MdDialogRef<LoginModalComponent>;
  // private loginResultSubscription: Subscription;

  private navbarData: NavbarData = new NavbarData();
  private navbarSubscription: Subscription;

  constructor(
    private navbarDataService: NavbarDataService, private modalService: MdDialog, private userApi: UserApi
  ) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
    this.userInfo = NO_USER_INFO;
    this.navbarData = Object.assign(new NavbarData(), { brandName: 'placeholder' });
    this.navbarSubscription =
      this.navbarDataService.navbarData.subscribe(this.updateNavbarData);
  }

  public ngOnDestroy() {
    this.navbarSubscription.unsubscribe();

    // if (this.loginResultSubscription) {
    //   this.loginResultSubscription.unsubscribe();
    //   this.loginResultSubscription = undefined;
    // }
    if (this.loginModalRef) {
      this.loginModalRef.close();
      // this.loginModalRef = undefined;
    }
  }

  updateNavbarData = (newData: NavbarData) => {
    // console.log("Navbar receives new data model: " + JSON.stringify(newData));
    this.navbarData = newData;
  }

  public onClickLogin() {
    this.loginModalRef =
      this.modalService.open(
        LoginModalComponent, { disableClose: false }
      );

    let loginResultSubscription = this.loginModalRef.afterClosed()
      .subscribe(
        result => {
          this.loginModalRef = undefined;
          loginResultSubscription.unsubscribe();

          console.log('result: ' + result);
          if (result) {
            this.userInfo = result.userInfo;
          }
        }
      );
  }

  public isLoggedIn() {
    return this.userApi.isAuthenticated();
  }

  public logout() {
    this.userApi.logout();
  }

  public onClickRegister() {

  }

  public onClickSettings() {

  }
}

