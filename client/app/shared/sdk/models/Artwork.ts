/* tslint:disable */
import {
  ImageChain
} from '../index';

declare var Object: any;
export interface ArtworkInterface {
  "uuid": string;
  "filename": string;
  "container": string;
  "url": string;
  "type"?: string;
  "title"?: string;
  "owner"?: string;
  "imageChainId"?: string;
  "createdAt"?: Date;
  "updatedAt"?: Date;
  imageChain?: ImageChain;
}

export class Artwork implements ArtworkInterface {
  "uuid": string;
  "filename": string;
  "container": string;
  "url": string;
  "type": string;
  "title": string;
  "owner": string;
  "imageChainId": string;
  "createdAt": Date;
  "updatedAt": Date;
  imageChain: ImageChain;
  constructor(data?: ArtworkInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Artwork`.
   */
  public static getModelName() {
    return "Artwork";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Artwork for dynamic purposes.
  **/
  public static factory(data: ArtworkInterface): Artwork{
    return new Artwork(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'Artwork',
      plural: 'Artworks',
      properties: {
        "uuid": {
          name: 'uuid',
          type: 'string'
        },
        "filename": {
          name: 'filename',
          type: 'string'
        },
        "container": {
          name: 'container',
          type: 'string'
        },
        "url": {
          name: 'url',
          type: 'string'
        },
        "type": {
          name: 'type',
          type: 'string'
        },
        "title": {
          name: 'title',
          type: 'string'
        },
        "owner": {
          name: 'owner',
          type: 'string'
        },
        "imageChainId": {
          name: 'imageChainId',
          type: 'string'
        },
        "createdAt": {
          name: 'createdAt',
          type: 'Date'
        },
        "updatedAt": {
          name: 'updatedAt',
          type: 'Date'
        },
      },
      relations: {
        imageChain: {
          name: 'imageChain',
          type: 'ImageChain',
          model: 'ImageChain'
        },
      }
    }
  }
}
