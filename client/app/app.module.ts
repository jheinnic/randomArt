import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {HttpModule, Http, CookieXSRFStrategy, BaseRequestOptions} from "@angular/http";
import {
  MdButtonModule, MdCardModule, MdIconModule, MdInputModule, MdTabsModule, MdToolbarModule,
  MdDialogModule, OverlayModule, PortalModule, MdChipsModule, MdSidenavModule, MdGridListModule,
  MdTooltipModule, MdCheckboxModule, MdMenuModule
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
import {NavBallsDirective} from "./navigation/navballs.directive";
import {CanvasAccessDirective} from "./shared/canvas-util/canvas-access.directive";
import {PhraseGeneratorService} from "./shared/phrase-generator/phrase-generator.service";

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
    CanvasAccessDirective,
    NoContentComponent,
    LoginModalComponent,
    GlobalNavbarComponent,
    NavBallsDirective,
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
    MdButtonModule.forRoot(),
    MdCardModule.forRoot(),
    MdCheckboxModule.forRoot(),
    MdChipsModule.forRoot(),
    MdDialogModule.forRoot(),
    MdGridListModule.forRoot(),
    MdIconModule.forRoot(),
    MdInputModule.forRoot(),
    MdMenuModule.forRoot(),
    MdSidenavModule.forRoot(),
    MdTabsModule.forRoot(),
    MdToolbarModule.forRoot(),
    MdTooltipModule.forRoot(),
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
    PhraseGeneratorService,
    PointStreamService
    // TokenCheckXHRBackend,
    // {provide: Http, useFactory: httpOverrideFactory, deps: [TokenCheckXHRBackend, BaseRequestOptions]},
    // {provide: XSRFStrategy, useFactory: configureXSRFStrategy }
  ], // exports: [HttpModule],
  exports: [
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
