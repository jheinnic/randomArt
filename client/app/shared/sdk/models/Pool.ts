/* tslint:disable */
import {
  ImageChain,
  Artwork
} from '../index';

declare var Object: any;
export interface PoolInterface {
  guid?: string;
  name: string;
  id?: any;
  imageChainId?: string;
  artworkIds?: Array<string>;
  createdAt: Date;
  updatedAt: Date;
  imageChain?: ImageChain;
  images?: Artwork[];
}

export class Pool implements PoolInterface {
  guid: string;
  name: string;
  id: any;
  imageChainId: string;
  artworkIds: Array<string>;
  createdAt: Date;
  updatedAt: Date;
  imageChain: ImageChain;
  images: Artwork[];
  constructor(data?: PoolInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Pool`.
   */
  public static getModelName() {
    return "Pool";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Pool for dynamic purposes.
  **/
  public static factory(data: PoolInterface): Pool{
    return new Pool(data);
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
      name: 'Pool',
      plural: 'Pools',
      properties: {
        guid: {
          name: 'guid',
          type: 'string'
        },
        name: {
          name: 'name',
          type: 'string'
        },
        id: {
          name: 'id',
          type: 'any'
        },
        imageChainId: {
          name: 'imageChainId',
          type: 'string'
        },
        artworkIds: {
          name: 'artworkIds',
          type: 'Array&lt;string&gt;',
          default: <any>[]
        },
        createdAt: {
          name: 'createdAt',
          type: 'Date'
        },
        updatedAt: {
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
        images: {
          name: 'images',
          type: 'Artwork[]',
          model: 'Artwork'
        },
      }
    }
  }
}
