/* tslint:disable */
import { Injectable, Inject, Optional } from '@angular/core';
import { Http, Response } from '@angular/http';
import { SDKModels } from './SDKModels';
import { BaseLoopBackApi } from '../core/base.service';
import { LoopBackConfig } from '../../lb.config';
import { LoopBackAuth } from '../core/auth.service';
import { LoopBackFilter,  } from '../../models/BaseModels';
import { JSONSearchParams } from '../core/search.params';
import { ErrorHandler } from '../core/error.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { Artwork } from '../../models/Artwork';
import { SocketConnection } from '../../sockets/socket.connections';


/**
 * Api services for the `Artwork` model.
 */
@Injectable()
export class ArtworkApi extends BaseLoopBackApi {

  constructor(
    @Inject(Http) protected http: Http,
    @Inject(SocketConnection) protected connection: SocketConnection,
    @Inject(SDKModels) protected models: SDKModels,
    @Inject(LoopBackAuth) protected auth: LoopBackAuth,
    @Inject(JSONSearchParams) protected searchParams: JSONSearchParams,
    @Optional() @Inject(ErrorHandler) protected errorHandler: ErrorHandler
  ) {
    super(http,  connection,  models, auth, searchParams, errorHandler);
  }

  /**
   * Uploads a file
   *
   * @param object data Request data.
   *
   *  - `req` – `{object}` - 
   *
   *  - `data` – `{string}` - 
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Artwork` object.)
   * </em>
   */
  public oldUpload(req: any = {}, data: any = {}): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/Artworks/oldUpload";
    let _routeParams: any = {};
    let _postBody: any = {
      data: data
    };
    let _urlParams: any = {};
    if (req) _urlParams.req = req;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody);
    return result;
  }

  /**
   * Uploads a file
   *
   * @param object data Request data.
   *
   *  - `title` – `{string}` - 
   *
   *  - `width` – `{string}` - 
   *
   *  - `height` – `{string}` - 
   *
   *  - `data` – `{string}` - 
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Artwork` object.)
   * </em>
   */
  public upload(title: any = {}, width: any = {}, height: any = {}, data: any = {}): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/Artworks/upload";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (title) _urlParams.title = title;
    if (width) _urlParams.width = width;
    if (height) _urlParams.height = height;
    if (data) _urlParams.data = data;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody);
    return result;
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `Artwork`.
   */
  public getModelName() {
    return "Artwork";
  }
}
