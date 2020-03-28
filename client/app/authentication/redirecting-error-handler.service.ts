/* tslint:disable */
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { MdDialog, MdDialogRef } from '@angular/material';
import { LoginModalComponent } from './login-modal.component';
import { Observable } from 'rxjs/Observable';

/**
 * Login-redirecting error handler
 */
@Injectable()
export class RedirectingErrorHandler {
  private readonly dialogService:MdDialog;
  private loginModalRef?:MdDialogRef<LoginModalComponent>;

  constructor( @Inject(MdDialog) dialogService: MdDialog ) {
    this.dialogService = dialogService;
  }

  public handleError(error: Response): Observable<String> {
    console.error("I am handling: ", error);
    if (error.status == 401) {
      this.loginModalRef = this.dialogService.open(LoginModalComponent, { disableClose: false });
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
