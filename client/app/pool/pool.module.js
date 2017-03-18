"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by jheinnic on 1/2/17.
 */
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var material_1 = require("@angular/material");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var point_mapping_config_service_1 = require("./point-mapping-config.service");
var image_store_service_1 = require("./image-store.service");
var word_paint_queue_service_1 = require("./word-paint-queue.service");
var point_mapping_service_1 = require("./point-mapping.service");
var image_lobby_component_1 = require("./image-lobby.component");
var image_lobby_side_component_1 = require("./image-lobby-side.component");
var image_lobby_action_component_1 = require("./image-lobby-action.component");
var pool_list_component_1 = require("./pool-list.component");
var image_chain_def_resolver_1 = require("./image-chain-def.resolver");
var new_pool_modal_component_1 = require("./new-pool-modal.component");
var paintable_directive_1 = require("../shared/canvas-util/paintable.directive");
var DEFAULT_LIVE_DELAY_DURATION = 360;
var DEFAULT_MAX_BUFFER_SIZE = 250;
var PoolModule = PoolModule_1 = (function () {
    function PoolModule() {
    }
    return PoolModule;
}());
PoolModule.routes = [
    {
        path: 'pools',
        resolve: {
            imageChainDef: image_chain_def_resolver_1.ImageChainDefResolver
        },
        children: [
            {
                path: ':poolId/images',
                pathMatch: 'full',
                component: image_lobby_component_1.ImageLobbyComponent
            }, {
                path: ':poolId/images',
                pathMatch: 'full',
                component: image_lobby_action_component_1.ImageLobbyActionComponent,
                outlet: 'action'
            }, {
                path: ':poolId/images',
                pathMatch: 'full',
                component: image_lobby_side_component_1.ImageLobbySideComponent,
                outlet: 'side'
            }
        ]
    }
];
PoolModule = PoolModule_1 = __decorate([
    core_1.NgModule({
        declarations: [
            pool_list_component_1.PoolListComponent,
            image_lobby_component_1.ImageLobbyComponent,
            image_lobby_side_component_1.ImageLobbySideComponent,
            image_lobby_action_component_1.ImageLobbyActionComponent,
            new_pool_modal_component_1.NewPoolModalComponent,
            paintable_directive_1.PaintableDirective
        ],
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            material_1.MdButtonModule,
            material_1.MdButtonToggleModule,
            material_1.MdCardModule,
            material_1.MdChipsModule,
            material_1.MdCheckboxModule,
            material_1.MdDialogModule,
            material_1.MdGridListModule,
            material_1.MdIconModule,
            material_1.MdInputModule,
            material_1.MdListModule,
            material_1.MdMenuModule,
            material_1.MdSelectModule,
            material_1.MdSidenavModule,
            material_1.MdProgressBarModule,
            material_1.MdTabsModule,
            material_1.MdToolbarModule,
            material_1.MdTooltipModule,
            ng_bootstrap_1.NgbModule,
            router_1.RouterModule.forChild(PoolModule_1.routes)
        ],
        providers: [
            {
                provide: point_mapping_config_service_1.pointMappingConfig,
                useValue: {
                    liveDelayDuration: DEFAULT_LIVE_DELAY_DURATION,
                    maxBufferSize: DEFAULT_MAX_BUFFER_SIZE
                }
            },
            point_mapping_config_service_1.PointMappingConfig,
            point_mapping_service_1.PointMappingService,
            word_paint_queue_service_1.WordPaintQueueService,
            image_store_service_1.ImageStoreService,
            image_chain_def_resolver_1.ImageChainDefResolver
        ],
        exports: [],
        entryComponents: []
    })
], PoolModule);
exports.PoolModule = PoolModule;
var PoolModule_1;
