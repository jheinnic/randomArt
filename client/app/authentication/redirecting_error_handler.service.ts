/* tslint:disable */
import { Injectable, Inject } from '@angular/core';
// import { Router } from '@angular/router';
import { Response } from '@angular/http';
import { MdDialog, MdDialogRef } from '@angular/material';
import { LoginModal } from '.';
import { Observable } from 'rxjs/Observable';
// import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
// import 'rxjs/add/observable';

/**
 * Login-redirecting error handler
 */
@Injectable()
export class RedirectingErrorHandler {
  private dialogService:MdDialog;
  private loginModalRef:MdDialogRef<LoginModal>;

  constructor( @Inject(MdDialog) dialogService: MdDialog ) {
    this.dialogService = dialogService;
  }

  public handleError(error: Response): Observable<String> {
    console.log("I am handling: ", error);
    if (error.status == 401) {
      this.loginModalRef = this.dialogService.open(LoginModal, { disableClose: false });
      this.loginModalRef.afterClosed().subscribe(
        (value) => { this.loginModalRef = undefined; },
        (error) => { this.loginModalRef = undefined; },
        () => { this.loginModalRef = undefined; }
      );

      return Observable.empty();
    } else {
      return Observable.throw(error.json().error || 'Server error');
    }
  }
}
