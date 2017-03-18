/**
 * Created by jheinnic on 1/2/17.
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Routes, RouterModule} from "@angular/router";
import {
  MdChipsModule, MdCardModule, MdButtonModule, MdButtonToggleModule, MdIconModule,
  MdProgressBarModule, MdTooltipModule, MdSidenavModule, MdInputModule, MdToolbarModule,
  MdCheckboxModule, MdTabsModule, MdListModule, MdDialogModule, MdGridListModule, MdMenuModule,
  MdSelectModule
} from "@angular/material";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {pointMappingConfig, PointMappingConfig} from "./point-mapping-config.service";
import {ImageStoreService} from "./image-store.service";
import {WordPaintQueueService} from "./word-paint-queue.service";
import {PointMappingService} from "./point-mapping.service";
import {ImageLobbyComponent} from "./image-lobby.component";
import {ImageLobbySideComponent} from "./image-lobby-side.component";
import {ImageLobbyActionComponent} from "./image-lobby-action.component";
import {PoolListComponent} from "./pool-list.component";
import {ImageChainDefResolver} from "./image-chain-def.resolver";
import {NewPoolModalComponent} from "./new-pool-modal.component";
import {PaintableDirective} from "../shared/canvas-util/paintable.directive";
import {ImageChainCacheService} from "./image-chain-cache.service";
import {PoolStoreService} from "./pool-store.service";
import {AppModule} from "../app.module";

const DEFAULT_LIVE_DELAY_DURATION = 360;
const DEFAULT_MAX_BUFFER_SIZE = 250;

@NgModule({
  declarations: [
    ImageLobbyComponent,
    ImageLobbySideComponent,
    ImageLobbyActionComponent,
    NewPoolModalComponent,
    PoolListComponent,
    PaintableDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    MdButtonModule,
    MdButtonToggleModule,
    MdCardModule,
    MdChipsModule,
    MdCheckboxModule,
    MdDialogModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdSelectModule,
    MdSidenavModule,
    MdProgressBarModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
    NgbModule,
    RouterModule.forChild(PoolModule.routes)
  ],
  providers: [
    {
      provide: pointMappingConfig,
      useValue: {
        liveDelayDuration: DEFAULT_LIVE_DELAY_DURATION,
        maxBufferSize: DEFAULT_MAX_BUFFER_SIZE
      }
    },
    PointMappingConfig,
    PointMappingService,
    WordPaintQueueService,
    ImageStoreService,
    ImageChainCacheService,
    PoolStoreService
  ],
  exports: [],
  entryComponents: []
})
export class PoolModule
{
  static routes: Routes = [
    {
      path: 'pools',
      // resolve: {
      //   imageChainDef: ImageChainDefResolver
      //   labSession: 'labSession',
      //   labSettings: 'labSettings'
      // },
      children: [
        {
          path: ':poolId/images',
          pathMatch: 'full',
          component: ImageLobbyComponent
        }, {
          path: ':poolId/images',
          pathMatch: 'full',
          component: ImageLobbyActionComponent,
          outlet: 'action'
        }, {
          path: ':poolId/images',
          pathMatch: 'full',
          component: ImageLobbySideComponent,
          outlet: 'side'
        }, {
          path: '',
          pathMatch: 'full',
          component: PoolListComponent,
        }, {
          path: '',
          pathMatch: 'full',
          component: ImageLobbyActionComponent,
          outlet: 'action'
        }, {
          path: '',
          pathMatch: 'full',
          component: ImageLobbySideComponent,
          outlet: 'side'
        }
      ]
    }
  ];

  constructor() {
  }
}
