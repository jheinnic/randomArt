/**
 * Created by jheinnic on 1/29/17.
 */
import {ImageChainDef} from "./image-chain-def.datamodel";
import {ImageStoreService} from "./image-store.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import * as uuid from "uuid";
import {Injectable} from "@angular/core";

const date = new Date();
const dateTime = date.getTime();

@Injectable()
export class ImageSequenceCacheService
{
  private chainDefCache = [
    new ImageChainDef({
      localId: 1,
      uuid: uuid.v4(),
      displayName: 'square, 240 x 240',
      pixelWidth: 240,
      pixelHeight: 240,
      pixelCount: 240 * 240,
      fitOrFill: 'square'
    }), new ImageChainDef({
      localId: 2,
      uuid: uuid.v4(),
      displayName: 'fill, 360 x 240',
      pixelWidth: 360,
      pixelHeight: 240,
      pixelCount: 360 * 240,
      fitOrFill: 'fill'
    }), new ImageChainDef({
      localId: 3,
      uuid: uuid.v4(),
      displayName: 'square, 360 x 360',
      pixelWidth: 360,
      pixelHeight: 360,
      pixelCount: 360 * 360,
      fitOrFill: 'square'
    }), new ImageChainDef({
      localId: 4,
      uuid: uuid.v4(),
      displayName: 'fit, 480 x 360',
      pixelWidth: 480,
      pixelHeight: 360,
      pixelCount: 480 * 360,
      fitOrFill: 'fit'
    }), new ImageChainDef({
      localId: 5,
      uuid: uuid.v4(),
      displayName: 'square, 480 x 480',
      pixelWidth: 480,
      pixelHeight: 480,
      pixelCount: 480 * 480,
      fitOrFill: 'square'
    }), new ImageChainDef({
      localId: 6,
      uuid: uuid.v4(),
      displayName: 'fit, 640 x 480',
      pixelWidth: 640,
      pixelHeight: 480,
      pixelCount: 640 * 480,
      fitOrFill: 'fit'
    }), new ImageChainDef({
      localId: 7,
      uuid: uuid.v4(),
      displayName: 'fill, 640 x 480',
      pixelWidth: 640,
      pixelHeight: 480,
      pixelCount: 640 * 480,
      fitOrFill: 'fill'
    })
  ];
  private subjects =
    this.chainDefCache.map(function(nextDef:ImageChainDef) {
      return new BehaviorSubject(nextDef);
    });

  constructor(private readonly imageStore: ImageStoreService) { }

  openCache(): void {
    console.log("Before: ");
    console
      .log(JSON
        .stringify(this
          .imageStore
          .getAllChainDefinitions()));
    this
      .imageStore
      .save(this.chainDefCache);
    console.log("After: ");
    console
      .log(JSON
        .stringify(this
          .imageStore
          .getAllChainDefinitions()));
  }


}
