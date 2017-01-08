/**
 * Created by jheinnic on 1/3/17.
 */
///<reference path='../../../node_modules/immutable/dist/immutable.d.ts'/>
import {unwrapHelper} from "../../../common/lib/datamodel-ts";
import {
  buildMethodFactory, ModelBuilder, Director, NoArgConstructor
} from "../../../common/lib/datamodel-ts/index";
import {EventEmitter} from "@angular/core";
import Immutable = require('immutable');
import _ = require('lodash');
import Peer = PeerJs.Peer;

export interface GenericCanvasDataModelBuilder {
  size(width: number, height: number) : GenericCanvasDataModelBuilder;

  label(label: string): GenericCanvasDataModelBuilder;

  unpackMemento(memento: CanvasDataModelMemento): GenericCanvasDataModelBuilder;
}

export interface PlotCanvasDataModelBuilder {
  size(width: number, height: number) : PlotCanvasDataModelBuilder;

  fill(x:number, y:number, width:number, height:number, color: string): PlotCanvasDataModelBuilder;

  clear(): PlotCanvasDataModelBuilder;

  label(label: string): PlotCanvasDataModelBuilder;

  unpackMemento(memento: CanvasDataModelMemento): PlotCanvasDataModelBuilder;
}

export interface StreamCanvasDataModelBuilder {
  size(width: number, height: number) : StreamCanvasDataModelBuilder;

  accept(mediaStream: MediaStream, connection: string, peer: string): StreamCanvasDataModelBuilder;

  request(peer: Peer): StreamCanvasDataModelBuilder;

  clear(): StreamCanvasDataModelBuilder;

  label(label: string): StreamCanvasDataModelBuilder;
}


export type PlotCanvasDataModelDirector =
  Director<CanvasDataModel, PlotCanvasDataModelBuilder>;

export type StreamCanvasDataModelDirector =
  Director<CanvasDataModel, StreamCanvasDataModelBuilder>;

export type CanvasDataModelMemento = string;


export interface CanvasDataModelErrors {
  readyForData: EventEmitter<number>
  plottingImage: EventEmitter<number>
  plotCancelled: EventEmitter<number>
  acquiringStream: EventEmitter<number>
  failedToAcquire: EventEmitter<number>
  imageOnDisplay: EventEmitter<number>
}

export interface ICanvasDataModel {
  canvas?: HTMLCanvasElement
  base64Memento?: string;
  connectionId?: string;
  peerId?: string;
  width?: number;
  height?: number;
  available?: boolean
  label?: string;
}

// NoArgConstructor<CanvasDataModel> { }

export class CanvasDataModel implements CanvasDataModelErrors, ICanvasDataModel {
  readonly canvas: HTMLCanvasElement
  readonly base64Memento: string;
  readonly connectionId: string;
  readonly peerId: string;
  readonly width: number;
  readonly height: number;
  readonly available: boolean
  readonly label: string;
  readonly pctLoaded: number;

  readonly readyForData: EventEmitter<number>
  readonly plottingImage: EventEmitter<number>
  readonly plotCancelled: EventEmitter<number>
  readonly acquiringStream: EventEmitter<number>
  readonly failedToAcquire: EventEmitter<number>
  readonly imageOnDisplay: EventEmitter<number>

  constructor(source?: ICanvasDataModel) {
    Object.assign(this, source);
  }

  packageMemento( ): boolean {
    return false;
  }
}
