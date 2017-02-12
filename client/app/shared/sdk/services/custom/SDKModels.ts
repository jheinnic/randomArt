/* tslint:disable */
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { PeerConnection } from '../../models/PeerConnection';
import { Email } from '../../models/Email';
import { StormpathUser } from '../../models/StormpathUser';
import { Container } from '../../models/Container';
import { ImageChain } from '../../models/ImageChain';
import { Artwork } from '../../models/Artwork';
import { Pool } from '../../models/Pool';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    User: User,
    PeerConnection: PeerConnection,
    Email: Email,
    StormpathUser: StormpathUser,
    Container: Container,
    ImageChain: ImageChain,
    Artwork: Artwork,
    Pool: Pool,
    
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
