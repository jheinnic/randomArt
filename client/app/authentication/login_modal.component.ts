import { Component, Inject, Optional, OpaqueToken } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { UserApi } from '../shared/sdk/services';
import { Observable } from 'rxjs/Observable';

export const LOGIN_TITLE: OpaqueToken = new OpaqueToken('LOGIN_TITLE');

interface Credentials {
  username: String;
  password: String;
};

@Component({
  selector: 'login_modal',
  templateUrl: './_login_modal.view.html'
})
export class LoginModal {
  private modalRef: MdDialogRef<LoginModal>;
  private userApi: UserApi;
  private loginTitle: String;
  private creds:Credentials = {
    username: null,
    password: null
  };

  constructor(
    modalRef: MdDialogRef<LoginModal>, userApi: UserApi, @Optional() @Inject(LOGIN_TITLE) loginTitle:String = 'Login'
  ) {
    this.modalRef = modalRef;
    this.userApi = userApi;
    this.loginTitle = loginTitle;
  }

  // This close function doesn't need to use jQuery or bootstrap, because
  // the button has the 'data-dismiss' attribute.
  login() {
    var result = {
      status: 'OK',
      key: this.creds.username,
      userId: this.creds.username,
      extra: this.creds.password
    };
    this.userApi.login(this.creds, undefined, true)
      .do((userInfo) => { console.log("Logged in as ", userInfo); })
      .catch((err, caught) => {
         console.error("Failed to login with ", this.creds, err, caught);
         return Observable.throw(err);
    });
    this.modalRef.close(result);
  }

  register() {
    // alert('TBD: Registration not yet implemented!');
    var result = {
      status: 'register',
      key: null,
      userId: null
    };

    // Now call close, returning control to the caller.
    this.modalRef.close(result);
  }

  forgotUsername() {
    // alert('TBD: Registration not yet implemented!');
    var result = {
      status: 'forgotUsername',
      key: null,
      userId: null
    };

    // Now call close, returning control to the caller.
    this.modalRef.close(result);
  }

  forgotPassword() {
    // alert('TBD: Registration not yet implemented!');
    var result = {
      status: 'forgotPassword',
      key: null,
      userId: this.creds.username
    };

    // Now call close, returning control to the caller.
    this.modalRef.close(result);
  }
}

