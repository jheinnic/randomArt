/**
 * Created by jheinnic on 12/25/16.
 */
import {Injectable, EventEmitter} from '@angular/core';

@Injectable( )
export class WordPaintService {
  private width: number;
  private height: number;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private modelFactory: any;
  private pixelGenerator: any;
  private currentPhrase: string;

  private workIntervalSize: number;
  private workIntervalCount: number;
  private onCancel: EventEmitter<String>;
  private onComplete: EventEmitter<String>;

  private pixelCount: number;
  private widthPoints;
  private heightPoints;
  private progressPoints;

  private ki: number = 0;
  private xi: number = 0;
  private yi: number = 0;

  public constructor( ) {
    this.modelFactory = require('./genjs');
  }

  // public initTargetCanvas( phrase: string, height: number, width: number, canvas: HTMLCanvasElement)
  public initTargetCanvas(
    phrase: string,
    canvas: HTMLCanvasElement,
    onComplete: EventEmitter<String>,
    onCancel: EventEmitter<String>,
    workIntervalSize:number
  ) : void {
    this.canvas = canvas;
    this.height = canvas.height;
    this.width =  canvas.width;

    this.context = canvas.getContext("2d");
    this.context.fillStyle = "rgb(255,255,255)";
    this.context.fillRect(0,0,this.width,this.height);

    this.currentPhrase = phrase;
    this.pixelGenerator = this.modelFactory.new_picture(phrase);

    this.onComplete = onComplete;
    this.onCancel = onCancel;

    this.pixelCount = this.height * this.width;
    this.workIntervalSize = workIntervalSize;
    this.workIntervalCount = this.height / this.workIntervalSize;
    if ((this.height % this.workIntervalSize) > 0) {
      this.workIntervalCount += 1;
    }

    // Precompute the mapping between pixel indices and coordinate positions.
    this.widthPoints = [];
    this.heightPoints = [];
    this.progressPoints = [];

    for (let ii=0; ii<this.width; ii++) {
      this.widthPoints.push(
        (2.0 * ((ii + 0.5)/this.width)) - 1.0);
    }
    for (let ii=0; ii<this.height; ii++) {
      this.heightPoints.push(
        (2.0 * ((ii + 0.5)/this.height)) - 1.0);
    }

    // Precompute the percent complete terminal points for each work iteration.
    for (let ii=0; ii<this.workIntervalCount; ii++) {
      this.progressPoints.push((1+ii) * 100.0 / this.height);
    }
  }

  public doNextInterval() : number {
    let xMax = Math.max(this.xi + this.workIntervalSize, this.height);

    for (; this.xi < xMax; this.xi++) {
      let xMap = this.heightPoints[this.xi];

      for (this.yi = 0; this.yi < this.width; this.yi++) {
        let yMap = this.widthPoints[this.yi];

        this.context.fillStyle =
          this.modelFactory.compute_pixel(
            this.pixelGenerator, xMap, yMap
          );

        this.context.fillRect(this.xi, this.yi, 1, 1);
      }
    }

    // Return true if we hae more work iterations left to go, otherwise return false;
    let progress = this.progressPoints[this.ki++];
    return progress;
  }

  /**
   * TODO: Deprecate this!
   *
   * @returns {string}
   */
  public getLatestPhrase() {
    return this.currentPhrase;
  }
}
