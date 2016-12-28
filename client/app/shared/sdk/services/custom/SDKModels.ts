/* tslint:disable */
import { Injectable } from '@angular/core';
import { Email } from '../../models/Email';
import { User } from '../../models/User';

@Injectable()
export class SDKModels {

  private models: { [name: string]: any } = {
    Email: Email,
    User: User,
    
  };

  public get(modelName: string): any {
    return this.models[modelName];
  }
}
