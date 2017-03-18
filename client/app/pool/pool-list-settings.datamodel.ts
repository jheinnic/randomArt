/**
 * Created by jheinnic on 2/5/17.
 */
import {ImageChainDef} from "./image-chain-def.datamodel";
import {ImageStoreService} from "./image-store.service";
import {Observable} from "rxjs";
import {
  buildMethodFactory, deriveFactoryWrapper, ReflectiveFluentBuilder, FactoryWrapper
} from "../../../common/lib/datamodel-ts/index";
import {Builder} from "fluent-interface-builder";

const wordPaintUserSettingsWrapper: Builder<FactoryWrapper<WordPaintUserSettings, ReflectiveFluentBuilder<WordPaintUserSettings>>, WordPaintUserSettings> =
  deriveFactoryWrapper<WordPaintUserSettings>(['imageData']);

export class WordPaintUserSettings {
  targetImageChainUuid: string;


  static build =
    buildMethodFactory(wordPaintUserSettingsWrapper, WordPaintUserSettings);

  constructor() { }

  }

  // public get targetImageChain(): Observable<ImageChainDef> {
  //   let chains: Observable<ImageChainDef[]> = this.imageStore.getAllChainDefinitions();
  //
  //   return chains.flatMap((value: ImageChainDef[]) =>
  //     Observable.from(value)
  //       .filter((nextValue: ImageChainDef) =>
  //         nextValue.uuid === this.targetImageChainUuid));
  // }
}
