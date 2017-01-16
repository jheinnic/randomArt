import {Component, Inject, Optional, OpaqueToken} from "@angular/core";
import {Location} from "@angular/common";
import {MdDialogRef} from "@angular/material";
import {Observable} from "rxjs/Observable";
import {UserApi} from "../shared/sdk/services";
import {LoopBackConfig} from "../shared/sdk/lb.config";
import {BASE_URL, API_VERSION} from "../shared/base-url.values";
import {User} from "../shared/sdk/models/User";

interface Credentials
{
  username: string | null;
  password: string | null;
}

@Component(
  {
    selector: 'login-modal',
    templateUrl: './_login-modal.view.html'
    // host: {
    //   '[class.d-flex]': 'true',
    //   '[class.flex-column]': 'true'
    // }
  }
)
export class LoginModalComponent
{
  private cred: Credentials = {
    username: null, password: null
  };
  private error: any;

  constructor(
    private modalRef: MdDialogRef<LoginModalComponent>,
    private userApi: UserApi, private location: Location
  ) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
    this.cred = { username: null, password: null };
  }

  // This close function doesn't need to use jQuery or bootstrap, because
  // the button has the 'data-dismiss' attribute.
  login() {
    return this.userApi.login(this.cred, undefined, true)
      .subscribe(
        (userData) => {
          let userInfo = this.extractProfile(userData);
          console.log("Logged in as ", userInfo);

          this.modalRef.close(userInfo);
          return userInfo;
        }, (error) => {
          console.error("Failed to login with " + this.cred, error);

          // TODO: Keep the modal open and display the error there
          this.showError(error);
          return Observable.throw(error);
        }
      );
  }

  private extractProfile(userData: User) {
    let firstName = '';
    let lastName = '';
    let photo = '';
    let email = '';

    if (userData && userData.identities && userData.identities[0] && userData.identities[0].profile) {
      let profile = userData.identities[0].profile;
      let name = profile.name;

      if (profile.photos && profile.photos[0] && profile.photos[0].value) {
        let photo = profile.photos[0].value;
      }

      if (profile.emails && profile.emails[0] && profile.emails[0].value) {
        let email = profile.emails[0].value;
      }
    }

    return {
      id: userData.id,
      firstName: firstName,
      lastName: lastName,
      photo: photo,
      email: email
    };
  }

  private showError(error) {
    this.error = error;
  }

  private hideError() {
    this.error = null;
  }

  register() {
    // alert('TBD: Registration not yet implemented!');
    let result = {
      status: 'register', key: null, userId: null
    };

    // Now call close, returning control to the caller.
    this.modalRef.close(result);
  }

  forgotUsername() {
    // alert('TBD: Registration not yet implemented!');
    let result = {
      status: 'forgotUsername', key: null, userId: null
    };

    // Now call close, returning control to the caller.
    this.modalRef.close(result);
  }

  forgotPassword() {
    // alert('TBD: Registration not yet implemented!');
    let result = {
      status: 'forgotPassword', key: null, userId: this.cred.username
    };

    // Now call close, returning control to the caller.
    this.modalRef.close(result);
  }
}

