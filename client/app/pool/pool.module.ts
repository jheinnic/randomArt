/**
 * Created by jheinnic on 1/2/17.
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Routes, RouterModule} from "@angular/router";
import {
  MdChipsModule, MdCardModule, MdButtonModule, MdIconModule, MdProgressBarModule,
  MdTooltipModule, MdSidenavModule, MdInputModule, MdToolbarModule, MdCheckboxModule,
  MdTabsModule
} from "@angular/material";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {pointMappingConfig, PointMappingConfig} from "./point-mapping-config.service";
import {ImageSequenceCacheService} from "./image-sequence-cache.service";
import {ImageStoreService} from "./image-store.service";
import {WordPaintQueueService} from "./word-paint-queue.service";
import {PointMappingService} from "./point-mapping.service";
import {ImageLobbyComponent} from "./image-lobby.component";
import {ImageLobbySideComponent} from "./image-lobby-side.component";
import {ImageLobbyActionComponent} from "./image-lobby-action.component";
import {ImageChainDefResolver} from "./image-chain-def.resolver";
import {PaintableDirective} from "../shared/canvas-util/paintable.directive";

@NgModule({
  declarations: [PoolLobbyComponent, ImageLobbyComponent, ImageLobbySideComponent, ImageLobbyActionComponent, PaintableDirective],
  imports: [
    CommonModule,
    FormsModule,
    MdButtonModule,
    MdChipsModule,
    MdCardModule,
    MdCheckboxModule,
    MdIconModule,
    MdInputModule,
    MdSidenavModule,
    MdProgressBarModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
    NgbModule,
    RouterModule.forChild(PoolModule.routes)
  ],
  providers: [
    {provide: pointMappingConfig, useValue: { liveDelayDuration: 360, maxBufferSize: 256 }},
    PointMappingConfig, PointMappingService, WordPaintQueueService, ImageStoreService,
    ImageSequenceCacheService, ImageChainDefResolver
  ],
  exports: []
})
export class PoolModule
{
  static routes: Routes = [
    {
      path: 'images',
      resolve: {
        'imageChainDef': ImageChainDefResolver
        // 'labSession': 'labSession',
        // 'labSettings': 'labSettings'
      },
      children: [
        {
          path: 'pools/:poolId/images',
          pathMatch: 'full',
          component: ImageLobbyComponent
        }, {
          path: 'pools/:poolId/images',
          pathMatch: 'full',
          component: ImageLobbyActionComponent,
          outlet: 'action'
        }, {
          path: 'pools/:poolId/images',
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
