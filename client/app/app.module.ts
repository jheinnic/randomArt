import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {HttpModule, Http, CookieXSRFStrategy, BaseRequestOptions} from "@angular/http";
import {
  MdButtonModule, MdCardModule, MdIconModule, MdInputModule, MdTabsModule, MdToolbarModule,
  MdDialogModule, OverlayModule, PortalModule, MdChipsModule, MdSidenavModule, MdGridListModule
} from "@angular/material";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {Chance} from "chance";
import {NoContentComponent} from "./no-content";
import {AppRootComponent} from "./app-root/app-root.component";
import {TokenCheckXHRBackend} from "./token-check-xhr-backend.service";
import {BlankAreaComponent} from "./shared";
import {AllPointsComponent, AllPixelsComponent, PaintablePointPipe, PointMapPipe, PointStreamService} from "./stream-play";
import {PoolModule, ImageLobbyComponent} from "./pool";
import {LoginModalComponent, RedirectingErrorHandler} from "./authentication";
import {GlobalNavbarComponent, NavbarDataService} from "./navigation";
import {SDKBrowserModule, ErrorHandler} from "./shared/sdk";
import {CanvasCacheModule} from "./shared/canvas-cache";
import {NewNamedCanvasModalComponent} from "./shared/phrase-generator/new-named-canvas-modal.component";

function httpOverrideFactory(
  xhrBackend: TokenCheckXHRBackend, requestOptions: BaseRequestOptions
) {
  return new Http(xhrBackend, requestOptions);
}

function configureXSRFStrategy() {
  return new CookieXSRFStrategy('XSRF', 'X-XSRF-Token');
}

@NgModule({
  declarations: [
    AppRootComponent,
    BlankAreaComponent,
    NoContentComponent,
    LoginModalComponent,
    GlobalNavbarComponent,
    NewNamedCanvasModalComponent,
    PointMapPipe,
    PaintablePointPipe,
    AllPointsComponent,
    AllPixelsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    PoolModule,
    MdCardModule.forRoot(),
    MdChipsModule.forRoot(),
    MdButtonModule.forRoot(),
    MdIconModule.forRoot(),
    MdInputModule.forRoot(),
    MdDialogModule.forRoot(),
    MdGridListModule.forRoot(),
    MdSidenavModule.forRoot(),
    MdTabsModule.forRoot(),
    MdToolbarModule.forRoot(),
    OverlayModule.forRoot(),
    PortalModule.forRoot(),
    NgbModule.forRoot(),
    CanvasCacheModule.forRoot(),
    RouterModule.forRoot(AppModule.routes),
    SDKBrowserModule.forRoot()
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: RedirectingErrorHandler
    },
    {
      provide: Chance,
      useFactory: Chance,
      deps: []
    },
    NavbarDataService,
    PointStreamService
    // TokenCheckXHRBackend,
    // {provide: Http, useFactory: httpOverrideFactory, deps: [TokenCheckXHRBackend, BaseRequestOptions]},
    // {provide: XSRFStrategy, useFactory: configureXSRFStrategy }
  ], // exports: [HttpModule],
  exports: [
    /*OverlayModule,
    PortalModule,
    MdButtonModule,
    MdCardModule,
    MdChipsModule,
    MdIconModule,
    MdInputModule,
    MdDialogModule,
    MdSidenavModule,
    MdTabsModule,
    MdToolbarModule,
    MdGridListModule,*/
    LoginModalComponent,
    NewNamedCanvasModalComponent,
    GlobalNavbarComponent
  ],
  entryComponents: [AppRootComponent, LoginModalComponent, NewNamedCanvasModalComponent],
  bootstrap: [AppRootComponent]
})
export class AppModule
{
  static routes: Routes = [
    {
      path: 'home',
      loadChildren: './+home#HomeModule'
    },
    {
      path: 'lobby',
      loadChildren: './+lobby#LobbyModule'
    },
    {
      path: 'pixelMaps',
      component: AllPixelsComponent
    },
    {
      path: 'pointMaps',
      component: AllPointsComponent
    },
    {
      path: 'images',
      component: ImageLobbyComponent
    },
    {
      path: 'peernet',
      loadChildren: './+peernet#PeernetModule'
    },
    {
      path: '**',
      component: NoContentComponent
    }
  ];
}

//const appRoutes: Routes = [
//  { path: 'passport/:id/:userId', component: PassportComponent }
//];
