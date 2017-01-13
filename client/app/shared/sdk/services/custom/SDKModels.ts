/* tslint:disable */
import { Injectable } from '@angular/core';
import { PeerConnection } from '../../models/PeerConnection';
import { Email } from '../../models/Email';
import { User } from '../../models/User';

interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    PeerConnection: PeerConnection,
    Email: Email,
    User: User,
    
  };

  public get(modelName: string): any {
    return this.models[modelName];
  }

  public getAll(): Models {
    return this.models;
  }

  public getModelNames(): string[] {
    return Object.keys(this.models);
  }
}
