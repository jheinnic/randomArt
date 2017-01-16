/* tslint:disable */
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { PeerConnection } from '../../models/PeerConnection';
import { Email } from '../../models/Email';
import { StormpathUser } from '../../models/StormpathUser';
import { Container } from '../../models/Container';
import { Artwork } from '../../models/Artwork';

interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    User: User,
    PeerConnection: PeerConnection,
    Email: Email,
    StormpathUser: StormpathUser,
    Container: Container,
    Artwork: Artwork,
    
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
