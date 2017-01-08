/**
 * Created by jheinnic on 1/5/17.
 */
import {NgModule, ModuleWithProviders} from "@angular/core";
import {DurableCanvasComponent} from "./durable-canvas.component";
import {DurableCanvasContainerComponent} from "./durable-canvas-container.component";
import {DurableCanvasService} from "./durable-canvas.service";
import {DurableCanvasRef} from "./durable-canvas-ref.datamodel";
import {SourceFromDirective} from "./source-from.directive";
import {CommonModule} from "@angular/common";
import {PortalModule} from "@angular/material";
import path = require('path');

@NgModule({
  id: path.resolve(__dirname, __filename),
  declarations: [DurableCanvasComponent, DurableCanvasContainerComponent, SourceFromDirective],
  imports: [CommonModule, PortalModule],
  exports: [SourceFromDirective, DurableCanvasContainerComponent],
  entryComponents:[DurableCanvasComponent],
  bootstrap: []
})
export class CanvasCacheModule {
  static forRoot():ModuleWithProviders {
    return {
      ngModule: CanvasCacheModule,
      providers: [DurableCanvasService]
    };
  }
}
