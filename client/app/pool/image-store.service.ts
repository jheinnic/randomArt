/**
 * Created by jheinnic on 1/12/17.
 */
import {Injectable} from "@angular/core";
import * as picolog from "picolog";
import * as WebDB from "imports-loader?log=picolog!webdb";
import {AsyncLocalStorage} from "angular-async-local-storage"
import {
  ImageSubmission, LocalImageRef, CachedImage
} from "./local-image.datamodel";
import {ImageChainDef} from "./image-chain-def.datamodel";
import {Observable} from "rxjs";
import {DIKeys} from "./keys/keys.dictionary";

type Table<T> = {
  get(): T[];
  set(t:T[]): void;
  /*
  get(id: number): T;
  get(Partial<T>...): T...
  set(t:T): void;
  set(t...:T): void;
   */
};


@Injectable()
export class ImageStoreService
{
  // private readonly webDb = WebDB('portfolio-local-images', {});

  private imageChainDefs: Observable<ImageChainDef[]>;
  private localImageRefs: Observable<LocalImageRef[]>;
  private cachedImages: Observable<CachedImage[]>;

  constructor(private readonly localStorage: AsyncLocalStorage) {
    console.log("ImageStoreService constructor");

    this.imageChainDefs = localStorage.getItem(DIKeys.imageChainDefs);
    this.localImageRefs = localStorage.getItem(DIKeys.localImageRefs);
    this.cachedImages   = localStorage.getItem(DIKeys.cachedImages);
    /*
    this.imageChainDef = this.webDb.createTable(ImageChainDef, 'imageChainDef', {
      localId: {
        type: Number,
        pk: true
      },
      version: {
        type: Number,
        version: true
      },
      uuid: {
        type: String,
        index: true,
        unique: true
      },
      displayName: {
        type: String,
        unique: true
      },
      widthIndices: String,
      heightIndices: String,
      pixelWidth: Number,
      pixelHeight: Number,
      createdAt: Number,
      modifiedAt: Number
    });

    this.imageSubmission = this.webDb.createTable(ImageSubmission, 'imageSubmission', {
      uuid: {
        type: String,
        pk: true
      },
      version: {
        type: Number,
        version: true
      },
      title: {
        type: String,
        index: true,
        unique: true
      },
      size: Number,
      url: String,
      origin: String,
      localChainId: {
        type: Number,
        fk: true,
        index: true
      },
      createdAt: Number,
      modifiedAt: Number
    });

    this.localImageRef = this.webDb.createTable(LocalImageRef, 'localImageRef', {
      localImageId: {
        type: Number,
        pk: true
      },
      imageUuid: {
        type: String,
        unique: true,
        index: true
      },
      localChainId: {
        type: String,
        fk: true
      },
      inCache: String, // Last three properties are
      isFavorite: String, // Boolean-encoded-as-String
      selfGenerated: String
    });


    this.cachedImage = this.webDb.createTable(CachedImage, 'cachedImage', {
      localImageId: { type: Number, pk: true },
      base64Data: String
    });
    */
  }

  public getAllChainDefinitions(): Observable<ImageChainDef[]> {
    return this.imageChainDefs;
  }

  save(chains: ImageChainDef[]) {
    let rollback = this.imageChainDefs;
    this.imageChainDefs = Observable.of(chains);
    this.localStorage.setItem(DIKeys.imageChainDefs, chains).subscribe(
      () => { console.log('Success'); },
      (err) => { console.error('Error! ' + err); this.imageChainDefs = rollback; },
      () => { console.log('Fin'); }
    );

  }

  public getAllLocalImagesRefs(): Observable<LocalImageRef[]> {
    return this.localImageRefs;
  }

  public saveLocalImage(refData: LocalImageRef, imgData: CachedImage) {
    this.localImageRefs.subscribe(
      (data:LocalImageRef[]) => {
        let newData: Array<LocalImageRef>;
        if (data) {
          newData = Array.from(data);
          newData.push(refData);
        } else {
          newData = Array.of(refData);
        }

        let rollback = this.localImageRefs;
        this.localImageRefs = Observable.of(newData)
        this.localStorage.setItem(DIKeys.localImageRefs, newData).subscribe(
          () => { console.log('Success') },
          (err) => { console.error('Error! ' + err); this.localImageRefs = rollback; },
          () => { console.log('Fin'); }
        )
      }
    );
    this.cachedImages.subscribe(
      (data:CachedImage[]) => {
        let newData: Array<CachedImage>;
        if (data) {
          newData = Array.from(data);
          newData.push(imgData);
        } else {
          newData = Array.of(imgData);
        }

        let rollback = this.cachedImages;
        this.cachedImages = Observable.of(newData)
        this.localStorage.setItem(DIKeys.cachedImages, newData).subscribe(
          () => { console.log('Success') },
          (err) => { console.error('Error! ' + err); this.cachedImages = rollback; },
          () => { console.log('Fin'); }
        )
      }
    );
  }
}
