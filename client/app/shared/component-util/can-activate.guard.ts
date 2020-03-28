/**
 * Created by jheinnic on 1/14/17.
 */
import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate
{
  private readonly _router: Router;

  constructor(router: Router) {
    this._router = router;
  }

  canActivate(): boolean {
    console.log('Checking whether may or may not activate!');
    let retval = true;
    if (!localStorage.getItem('currentUser')) {
      // not logged in, so redirect to login page and return false.
      this._router.navigate(['/login']);
      retval = false;
    }

    return retval;
  }
}
