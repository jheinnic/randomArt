import {Component, Inject, Optional, OpaqueToken} from "@angular/core";
import {MdDialogRef} from "@angular/material";
import {UserApi} from "../shared/sdk/services";
import {Observable} from "rxjs/Observable";

interface Credentials {
  username: string | null;
  password: string | null;
}

export const LOGIN_TITLE: OpaqueToken = new OpaqueToken('LOGIN_TITLE');

@Component({
  selector: 'login_modal', templateUrl: './_login_modal.view.html'
})
export class LoginModal {
  private modalRef: MdDialogRef<LoginModal>;
  private userApi: UserApi;
  private loginTitle: string;
  private cred: Credentials = {
    username: null, password: null
  };

  constructor(modalRef: MdDialogRef<LoginModal>, userApi: UserApi, @Optional() @Inject(LOGIN_TITLE) loginTitle: string = 'Login') {
    this.modalRef = modalRef;
    this.userApi = userApi;
    this.loginTitle = loginTitle;
  }

  // This close function doesn't need to use jQuery or bootstrap, because
  // the button has the 'data-dismiss' attribute.
  login() {
    return this.userApi.login(this.cred, undefined, true)
      .do((userInfo) => {
        console.log("Logged in as ", userInfo);

        this.modalRef.close(userInfo);
        return userInfo
      }).catch((err, caught) => {
        console.error("Failed to login with ", this.cred, err, caught);
        return Observable.throw(err);
      });
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

