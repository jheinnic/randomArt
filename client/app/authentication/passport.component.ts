/**
 * Created by jheinnic on 1/14/17.
 */
import {Component, Inject, OnDestroy} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {LoopBackAuth} from "../shared/sdk/services";
import {DIKeys} from "../shared/keys/keys.dictionary";
import {UserApi} from "../shared/sdk/services/custom/User";
import {User} from "../shared/sdk/models/User";
import {Subscription} from "rxjs";
import path = require('path');

interface TokenKeys
{
  tokenId: string,
  userId: string
}

@Component({
  moduleId: path.resolve(__dirname, __filename),
  template: '&nbsp;'
})
export class PassportComponent implements OnDestroy
{
  private lookupSubscription: Subscription;
  private routeSubscription: Subscription;

  constructor(
    private auth: LoopBackAuth, private userApi: UserApi, private route: ActivatedRoute,
    private router: Router, @Inject(DIKeys.authHomeRoute) private authHomeUrl: string
  ) {
    // this.route.params.subscribe((token: SDKToken) => {
    this.routeSubscription = this.route.params.subscribe((tokenKeys: TokenKeys) => {
      console.log('Passport params retrieved for ' + JSON.stringify(tokenKeys));
      let issueDate = new Date();
      let tokenData = {
        id: tokenKeys.tokenId,
        userId: tokenKeys.userId,
        created: issueDate,
        issuedAt: issueDate,
        rememberMe: false,
        scopes: [],
        ttl: 1209600,
        user: {}
      };
      auth.setToken(tokenData);
      auth.save();

      this.lookupSubscription = userApi.findById(tokenKeys.userId, {include: "identities"})
        .subscribe((userData: User) => {
          console.log('Lookup from params yields: ' + JSON.stringify(userData));
          if (userData) {
            tokenData.user = userData;
            this.auth.setUser(userData);
            this.auth.save();
            this.router.navigate([authHomeUrl]);
          } else {
            console.error(`Failed to retrieve user data for ${tokenData}`);
            this.router.navigate(['/login']);
          }
        },
          (err: any) => { console.error(err); },
          () => { this.lookupSubscription = null; });
    },
      (err: any) => { console.error(err); },
      () => { this.routeSubscription = null; });
  }

  public ngOnDestroy(): void {
    if (this.lookupSubscription) {
      this.lookupSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
