import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {HttpModule} from "@angular/http";
import {MdButtonModule, MdInputModule, MdToolbarModule, MdDialogModule, MdDialog} from "@angular/material";
import {HomeModule} from "app/+home";
import {LobbyModule} from "app/+lobby";
import {NoContentComponent} from "app/no-content";
import {AppComponent} from "app/app.component";
import {LoginModal, RedirectingErrorHandler} from "app/authentication";
import {GlobalNavbar} from "app/navigation";
import {SDKBrowserModule} from "app/shared/sdk";
import {ErrorHandler} from "app/shared/sdk/services/core";
import {EmailApi, UserApi} from "app/shared/sdk/services/custom";
import {AppState} from "app/app.service";
import {routes} from "app/app.routes";

@NgModule({
  declarations: [AppComponent, NoContentComponent, LoginModal, GlobalNavbar], /* MdDialogActions, MdDialogClose, MdDialogContent, MdDialogTitle, MdInputContainer],*/
  imports: [
    BrowserModule,
    CommonModule,
    HttpModule,
    FormsModule,
    MdButtonModule.forRoot(),
    MdInputModule.forRoot(),
    MdToolbarModule.forRoot(),
    MdDialogModule.forRoot(),
    HomeModule,
    LobbyModule,
    RouterModule.forRoot(routes),
    SDKBrowserModule.forRoot()
  ],
  providers: [
    {provide: ErrorHandler, useClass: RedirectingErrorHandler},
    {provide: MdDialog, useClass: MdDialog},
    {provide: EmailApi, useClass: EmailApi},
    {provide: UserApi, useClass: UserApi},
    {provide: AppState, useClass: AppState}
  ],
  entryComponents: [AppComponent, LoginModal],
  bootstrap: [AppComponent],
})
export class AppModule {
  static routes = routes;
}

//const appRoutes: Routes = [
//  { path: 'passport/:id/:userId', component: PassportComponent }
//];

