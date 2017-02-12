/**
 * Created by jheinnic on 2/5/17.
 */
import {ImageChainDef} from "./image-chain-def.datamodel";
import {ImageStoreService} from "./image-store.service";
import {Observable} from "rxjs";

export class WordPaintUserSettings {
  targetImageChainUuid: string;

  constructor(private readonly imageStore: ImageStoreService) {

  }

  public get targetImageChain(): Observable<ImageChainDef> {
    let chains: Observable<ImageChainDef[]> = this.imageStore.getAllChainDefinitions();

    return chains.flatMap((value: ImageChainDef[]) =>
      Observable.from(value)
        .filter((nextValue: ImageChainDef) =>
          nextValue.uuid === this.targetImageChainUuid));
  }
}
