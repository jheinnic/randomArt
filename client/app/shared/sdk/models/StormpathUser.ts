/* tslint:disable */

declare var Object: any;
export interface StormpathUserInterface {
  "givenName": string;
  "middleName"?: string;
  "surname": string;
  "username"?: string;
  "email": string;
  "status"?: string;
  "createdAt"?: Date;
  "modifiedAt"?: Date;
  "id"?: string;
}

export class StormpathUser implements StormpathUserInterface {
  "givenName": string;
  "middleName": string;
  "surname": string;
  "username": string;
  "email": string;
  "status": string;
  "createdAt": Date;
  "modifiedAt": Date;
  "id": string;
  constructor(data?: StormpathUserInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `StormpathUser`.
   */
  public static getModelName() {
    return "StormpathUser";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of StormpathUser for dynamic purposes.
  **/
  public static factory(data: StormpathUserInterface): StormpathUser{
    return new StormpathUser(data);
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
      name: 'StormpathUser',
      plural: 'StormpathUsers',
      properties: {
        "givenName": {
          name: 'givenName',
          type: 'string'
        },
        "middleName": {
          name: 'middleName',
          type: 'string'
        },
        "surname": {
          name: 'surname',
          type: 'string'
        },
        "username": {
          name: 'username',
          type: 'string'
        },
        "email": {
          name: 'email',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'string'
        },
        "createdAt": {
          name: 'createdAt',
          type: 'Date'
        },
        "modifiedAt": {
          name: 'modifiedAt',
          type: 'Date'
        },
        "id": {
          name: 'id',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
