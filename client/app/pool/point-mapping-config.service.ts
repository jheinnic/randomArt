import {OpaqueToken, Inject, Injectable, Optional} from "@angular/core";
import {Partial} from "../../../common/lib/datamodel-ts/index";
/**
 * Created by jheinnic on 1/26/17.
 */

export const pointMappingConfig = new OpaqueToken("pointMappingConfig");

@Injectable()
export class PointMappingConfig {
  liveDelayDuration: number = 750;
  maxBufferSize: number = 750;

  constructor( @Optional() @Inject(pointMappingConfig) config?: Partial<PointMappingConfig> ) {
    Object.assign(this, config);
  }
}
