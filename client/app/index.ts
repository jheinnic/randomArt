import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {HttpModule, Http, XSRFStrategy, CookieXSRFStrategy, BaseRequestOptions} from "@angular/http";
import {MdButtonModule, MdInputModule, MdToolbarModule, MdDialogModule} from "@angular/material";
import {Chance} from "chance";
import {NoContentComponent} from "./no-content";
import {AppComponent} from "./app.component";
import {AppState} from "./app.service";
import {TokenCheckXHRBackend} from "./token_check_xhr_backend.service";
import {LoginModal, RedirectingErrorHandler} from "./authentication";
import {GlobalNavbar} from "./navigation";
import {ErrorHandler, EmailApi, UserApi} from "./shared/sdk/services";
import {SDKBrowserModule} from "./shared/sdk";
import {routes} from "./app.routes";

function httpOverrideFactory(xhrBackend:TokenCheckXHRBackend, requestOptions:BaseRequestOptions) {
  return new Http(xhrBackend, requestOptions);
}

function configureXSRFStrategy() {
  return new CookieXSRFStrategy('XSRF', 'X-XSRF-Token');
}

@NgModule({
  declarations: [AppComponent, NoContentComponent, LoginModal, GlobalNavbar],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    MdButtonModule.forRoot(),
    MdInputModule.forRoot(),
    MdToolbarModule.forRoot(),
    MdDialogModule.forRoot(),
    RouterModule.forRoot(routes),
    SDKBrowserModule.forRoot()
  ],
  providers: [
    {provide: ErrorHandler, useClass: RedirectingErrorHandler},
    {provide: Chance, useFactory: Chance, deps: []},
    // {provide: MdDialog, useClass: MdDialog},
    EmailApi, // {provide: EmailApi, useClass: EmailApi},
    UserApi, // {provide: UserApi, useClass: UserApi},
    AppState, // {provide: AppState, useClass: AppState},
    // TokenCheckXHRBackend,
    // {provide: Http, useFactory: httpOverrideFactory, deps: [TokenCheckXHRBackend, BaseRequestOptions]},
    // {provide: XSRFStrategy, useFactory: configureXSRFStrategy }
  ],
  // exports: [HttpModule],
  entryComponents: [AppComponent, LoginModal],
  bootstrap: [AppComponent] // , HttpModule]
})
export class AppModule {
  static routes = routes;
}

//const appRoutes: Routes = [
//  { path: 'passport/:id/:userId', component: PassportComponent }
//];

