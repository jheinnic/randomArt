/**
 * Created by jheinnic on 1/2/17.
 */
import {
  Component, NgZone, EventEmitter, Output, ViewChildren, OnInit, ElementRef, Host
} from "@angular/core";
import {PointMappingService} from "./point-mapping.service";
import {PointMap, PaintablePoint} from "./point.datamodel";
import {Observable} from "rxjs/Observable";
import {PhraseGeneratorService} from "../shared/phrase-generator/phrase-generator.service";
import {ArtworkApi} from "../shared/sdk/services/custom/Artwork";
import {ImageChainDef} from "./local-image.datamodel";
import {
  AbstractComponentLifecycle, ErrorSeverity
} from "../shared/component-util/abstract-component-lifecycle.class";
import {TaskProgress, TaskError} from "../shared/component-util/task.datamodel";
import uuid = require('uuid');
import _ = require('lodash');
import {CanvasAccessDirective} from "../shared/canvas-util/canvas-access.directive";

const MAX_BUFFER_SIZE: number = 2000;
const LIVE_LATENCY: number = 600;


@Component({
  moduleId: "./app/pool/word-paint.component",
  selector: "word-painter",
  inputs: ["inputPhrase", "imageChainDef"],
  outputs: [
    "onReady:canvasReady",
    "onBegin:paintBegin",
    "onProgress:paintProgress",
    "onPause:paintPause",
    "onResume:paintResume",
    "onFinish:paintFinish",
    "onCancel:paintCanel",
    "onError:paintError"
  ],
  providers: [PointMappingService],
  template: require("./_word-paint.view.html")
})
export class WordPaintComponent implements OnInit // extends
// AbstractComponentLifecycle<string,PaintablePoint[],number> implements OnInit
{
  private imageChainDef: ImageChainDef;
  private inputPhrase: string;
  private currentPhrase: string;

  // private widthPoints: number[];
  // private heightPoints: number[];
  // private scalePoints: Observable<PointMap>;

  private canvasWidth = 640;
  private canvasHeight = 480;
  private paintCounter = 0;

  // @ViewChildren('canvas') attr1: CanvasAccessDirective;
  @ViewChildren('canvas') canvasRef: ElementRef;
  private context: CanvasRenderingContext2D | null;

  @Output() private canvasReady: EventEmitter<void>;
  @Output() private paintBegin: EventEmitter<string>;
  @Output() private paintDone: EventEmitter<number>;
  @Output() private paintPause: EventEmitter<void>;
  @Output() private paintResume: EventEmitter<void>;
  @Output() private paintCancel: EventEmitter<void>;
  @Output() private paintReset: EventEmitter<void>;
  @Output() private paintRelease: EventEmitter<void>;
  @Output() private paintProgress: EventEmitter<TaskProgress<string,PaintablePoint[],number>>;
  @Output() private paintAnyError: EventEmitter<[ErrorSeverity, TaskError<string,PaintablePoint[],number>]>;

  constructor( ngZone: NgZone, private readonly pointService: PointMappingService,
    @Host() private readonly canvasAccess: CanvasAccessDirective ) {
    super(ngZone);

    this.canvasReady = this.onReady;
    this.paintBegin = this.onBegin;
    this.paintDone = this.onDone;
    this.paintProgress = this.onProgress;
    this.paintPause = this.onPause;
    this.paintReset = this.onReset;
    this.paintResume = this.onResume;
    this.paintCancel = this.onCancel;
    this.paintAnyError = this.onAnyError;

    this.canvasWidth = this.imageChainDef.pixelWidth;
    this.canvasHeight = this.imageChainDef.pixelHeight;
    this.pointService.mapRectangularRegion(this.canvasWidth, this.canvasHeight, 'fit');

    let canvas = this.canvasRef.nativeElement;
    this.context = canvas.getContext('2d'); // .getContext('2d', {storage: true});

    this.context = canvasAccess.context;
    this.context.fillStyle = 'rgb(0,0,0)';
    this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }


  public ngOnInit() {
    // close;

    /*
     this.widthPoints = this.imageChainDef.widthPoints.split(', ')
     .map((value) => {
     return +value;
     });
     this.heightPoints = this.imageChainDef.heightPoints.split(', ')
     .map((value) => {
     return +value;
     });
     this.scalePoints =
     this.pointService.mapRectangularRegion(
     this.widthPoints, this.heightPoints, 'fit'
     );
     */
    this.pointService.liveDelayDuration = LIVE_LATENCY;
    this.pointService.maxBufSize = MAX_BUFFER_SIZE;

    this.ready();
  }

  public paint() {
    this.paintCounter = 0;
    this.currentPhrase = this.inputPhrase;
    this.pointService.seedPhrase = this.currentPhrase;
    const outputSubject = this.pointService.stepSequence;

    this.begin(this.currentPhrase, outputSubject, 0);
  }

  public getImageDataFor(task: string): string {
    return null;
  }

  public getImageBlobFor(task: string): Blob {
    return null;
  }

  protected doWorkStep(paintPoints: PaintablePoint[]): number {
    paintPoints.forEach(function (paintPoint) {
      paintPoint.paintTo(this.context);
    });

    this.paintCounter += paintPoints.length;
    return this.paintCounter;
  }
}

/**
 * Converts a base64 string to byte array.
 */
function base64toBlob(
  base64Data: string, contentType: string = '', sliceSize: number = 512
): Blob {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, {type: contentType});
}
