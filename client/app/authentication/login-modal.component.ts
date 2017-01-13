import {Component, Inject, Optional, OpaqueToken} from "@angular/core";
import {MdDialogRef} from "@angular/material";
import {UserApi} from "../shared/sdk/services";
import {Observable} from "rxjs/Observable";

interface Credentials
{
  username: string | null;
  password: string | null;
}

export const LOGIN_TITLE: OpaqueToken = new OpaqueToken('LOGIN_TITLE');

@Component(
  {
    selector: 'login-modal',
    templateUrl: './_login-modal.view.html',
    host: {
      '[class.d-flex]': 'true',
      '[class.flex-column]': 'true'
    }
  }
)
export class LoginModalComponent
{
  private cred: Credentials = {
    username: null, password: null
  };
  private error: any;

  constructor(
    private modalRef: MdDialogRef<LoginModalComponent>, private userApi: UserApi,
    @Optional() @Inject(LOGIN_TITLE) private loginTitle: string = 'Login'
  ) {
    this.cred = { username: null, password: null };
  }

  // This close function doesn't need to use jQuery or bootstrap, because
  // the button has the 'data-dismiss' attribute.
  login() {
    return this.userApi.login(this.cred, undefined, true)
      .subscribe(
        (userInfo) => {
          console.log("Logged in as ", userInfo);

          this.modalRef.close(userInfo);
          return userInfo
        }, (error) => {
          console.error("Failed to login with " + this.cred, error);

          // TODO: Keep the modal open and display the error there
          this.showError(error);
          return Observable.throw(error);
        }
      );
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

