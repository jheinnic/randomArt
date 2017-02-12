import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {HttpModule, CookieXSRFStrategy, XSRFStrategy} from "@angular/http";
import {AsyncLocalStorageModule} from 'angular-async-local-storage';
import {
  MdButtonModule, MdCardModule, MdIconModule, MdInputModule, MdTabsModule, MdToolbarModule,
  MdDialogModule, OverlayModule, PortalModule, MdChipsModule, MdSidenavModule, MdGridListModule,
  MdTooltipModule, MdCheckboxModule, MdMenuModule
} from "@angular/material";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {Chance} from "chance";
import {NoContentComponent} from "./no-content";
import {
  AppRootComponent, NavbarDataService, TopToolbarComponent, InnerNavbarComponent,
  FloatingActionsComponent
} from "./app-root";
// import {
  // AllPointsComponent, AllPixelsComponent, PaintablePointPipe, PointMapPipe, PointStreamService
// } from "./stream-play";
import {PoolModule, ImageLobbyComponent} from "./pool";
import {
  LoginModalComponent, PassportComponent, RedirectingErrorHandler
} from "./authentication";
import {SDKBrowserModule, ErrorHandler} from "./shared/sdk";
import {CanvasCacheModule} from "./shared/canvas-cache";
import {NewNamedCanvasModalComponent} from "./shared/phrase-generator/new-named-canvas-modal.component";
import {NavBallsDirective} from "./app-root/navballs.directive";
// import {CanvasAccessDirective} from "./shared/canvas-util/canvas-access.directive";
import {PhraseGeneratorService} from "./shared/phrase-generator/phrase-generator.service";
import {DIKeys} from "./shared/keys/keys.dictionary";
import {GoogleLoginComponent} from "./authentication/google-login.component";
import {ImageLobbySideComponent} from "./pool/image-lobby-side.component";
import {ImageLobbyActionComponent} from "./pool/image-lobby-action.component";
import {ScrollActionComponent} from "./scrolltest/scroll-action.component";
import {ScrollSideComponent} from "./scrolltest/scroll-side.component";
import {ScrollMainComponent} from "./scrolltest/scroll-main.component";
import {ScrollModule} from "./scrolltest/scroll.module";
import {CanvasAccessDirective} from "./shared/canvas-util/canvas-access.directive";
import {PaintableDirective} from "./shared/canvas-util/paintable.directive";

function configureXSRFStrategy() {
  return new CookieXSRFStrategy('XSRF', 'X-XSRF-Token');
}

@NgModule({
  declarations: [
    CanvasAccessDirective,
    NoContentComponent,
    GoogleLoginComponent,
    LoginModalComponent,
    PassportComponent,
    TopToolbarComponent,
    InnerNavbarComponent,
    FloatingActionsComponent,
    NewNamedCanvasModalComponent,
    NavBallsDirective,
    // PointMapPipe,
    // PaintablePointPipe,
    // AllPointsComponent,
    // AllPixelsComponent,
    AppRootComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    AsyncLocalStorageModule,
    PoolModule,
    ScrollModule,
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
    }, {
      provide: Chance,
      useFactory: Chance,
      deps: []
    }, {
      provide: DIKeys.authHomeRoute,
      useValue: '/home'
    }, {
      provide: DIKeys.apiUriHost,
      useValue: 'portfolio-api.dev.jchein.name:3000'
    }, {
      provide: DIKeys.googleLoginUrl,
      useValue: 'http://portfolio-api.dev.jchein.name:3000/auth/google'
    }, NavbarDataService, PhraseGeneratorService, {
      provide: XSRFStrategy,
      useFactory: configureXSRFStrategy
    }
  ],
  exports: [RouterModule, LoginModalComponent, NewNamedCanvasModalComponent, CanvasAccessDirective],
  entryComponents: [
    AppRootComponent,
    LoginModalComponent,
    GoogleLoginComponent,
    PassportComponent,
    NewNamedCanvasModalComponent,
    InnerNavbarComponent,
    TopToolbarComponent,
    FloatingActionsComponent
  ],
  bootstrap: [AppRootComponent]
})
export class AppModule
{
  static routes: Routes = [
    {
      path: 'images',
      loadChildren: './pool/pool.module'
    }, {
      path: 'login',
      children: [
        {
          path: 'google',
          pathMatch: 'full',
          component: GoogleLoginComponent
        }
      ]
    }, {
      path: 'passport/:tokenId/:userId',
      pathMatch: 'full',
      component: PassportComponent
    }, {
      path: 'home',
      loadChildren: './+home/home.module#HomeModule'
    }, {
      path: 'lobby',
      loadChildren: './+lobby/lobby.module#LobbyModule'
    }, {
      path: 'pixelMaps',
      children: [ ]
    //     {
    //       path: '',
    //       pathMatch: 'full',
    //       component: AllPixelsComponent
    //     }
    //   ]
    // }, {
    //   path: 'pointMaps',
    //   children: [
    //     {
    //       path: '',
    //       pathMatch: 'full',
    //       component: AllPointsComponent
    //     }
    //   ]
    }, {
      path: 'scroll',
      loadChildren: 'app/scrolltest/scroll.module'
    }, {
      path: 'peernet',
      loadChildren: './+peernet/peernet.module#PeernetModule'
    }, {
      path: '**',
      pathMatch: 'full',
      component: NoContentComponent
    }
  ];
}
