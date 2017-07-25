/* tslint:disable */
import {
  User
} from '../index';

declare var Object: any;
export interface PeerConnectionInterface {
  "peerId"?: string;
  "active"?: boolean;
  "userId"?: any;
  user?: User;
}

export class PeerConnection implements PeerConnectionInterface {
  "peerId": string;
  "active": boolean;
  "userId": any;
  user: User;
  constructor(data?: PeerConnectionInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PeerConnection`.
   */
  public static getModelName() {
    return "PeerConnection";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PeerConnection for dynamic purposes.
  **/
  public static factory(data: PeerConnectionInterface): PeerConnection{
    return new PeerConnection(data);
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
      name: 'PeerConnection',
      plural: 'PeerConnections',
      properties: {
        "peerId": {
          name: 'peerId',
          type: 'string'
        },
        "active": {
          name: 'active',
          type: 'boolean'
        },
        "userId": {
          name: 'userId',
          type: 'any'
        },
      },
      relations: {
        user: {
          name: 'user',
          type: 'User',
          model: 'User'
        },
      }
    }
  }
}
