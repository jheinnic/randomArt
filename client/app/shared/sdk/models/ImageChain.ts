/* tslint:disable */

declare var Object: any;
export interface ImageChainInterface {
  guid?: string;
  displayName: string;
  pixelWidth: number;
  pixelHeight: number;
  fitOrFill: string;
  pixelCount?: number;
  pointMaps?: any;
  owner?: string;
}

export class ImageChain implements ImageChainInterface {
  guid: string;
  displayName: string;
  pixelWidth: number;
  pixelHeight: number;
  fitOrFill: string;
  pixelCount: number;
  pointMaps: any;
  owner: string;
  constructor(data?: ImageChainInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ImageChain`.
   */
  public static getModelName() {
    return "ImageChain";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ImageChain for dynamic purposes.
  **/
  public static factory(data: ImageChainInterface): ImageChain{
    return new ImageChain(data);
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
      name: 'ImageChain',
      plural: 'ImageChains',
      properties: {
        guid: {
          name: 'guid',
          type: 'string'
        },
        displayName: {
          name: 'displayName',
          type: 'string'
        },
        pixelWidth: {
          name: 'pixelWidth',
          type: 'number'
        },
        pixelHeight: {
          name: 'pixelHeight',
          type: 'number'
        },
        fitOrFill: {
          name: 'fitOrFill',
          type: 'string'
        },
        pixelCount: {
          name: 'pixelCount',
          type: 'number'
        },
        pointMaps: {
          name: 'pointMaps',
          type: 'any'
        },
        owner: {
          name: 'owner',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
