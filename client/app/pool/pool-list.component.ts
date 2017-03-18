/**
 * Created by jheinnic on 1/2/17.
 */
import {
  Component, ViewChild, AfterViewInit, OnInit, OnDestroy, ElementRef, ViewChildren
} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {PhraseGeneratorService} from "../shared/phrase-generator/phrase-generator.service";
import {PaintableDirective, Dimensions} from "../shared/canvas-util/paintable.directive";
import {ArtworkApi} from "../shared/sdk/services/custom/Artwork";
import {PointMappingService, PaintProgress} from "./point-mapping.service";
import {WordPaintQueueService} from "./word-paint-queue.service";
import {WordPaintTask} from "./word-paint-task.datamodel";
import {ImageChainDef} from "./image-chain-def.datamodel";
import {ImageStoreService} from "./image-store.service";
import {NavbarDataService, NavbarDataModelBuilder, MenuNavDataModelBuilder } from "../app-root";
import {ServiceEventType, ServiceStage} from "../shared/service-util/service-lifecycle.datamodel";
import {QueueChange} from "../shared/service-util/abstract-queue.service";
import {
  TaskEventType, ProgressTaskEvent, FinishedTaskEvent, BeganTaskEvent, HardErrorTaskEvent,
  SoftErrorTaskEvent, CancelledTaskEvent, AcknowledgedTaskEvent
} from "../shared/service-util/task-lifecycle.datamodel";
import {PaintablePoint} from "../shared/canvas-util/point.datamodel";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import uuid = require('uuid');
import _ = require('lodash');


const MIN_QUEUE_SIZE: number = 8;
const MAX_BUFFER_SIZE: number = 2000;
const LIVE_LATENCY: number = 600;


@Component({
  moduleId: "./app/pool",
  selector: "image-lobby",
  inputs: [],
  template: require("./_image-lobby.view.html"),
  styleUrls: ["./_image-lobby.scss"]
})
export class ImageLobbyComponent implements OnInit, AfterViewInit, OnDestroy
{
 private allImageChains: ImageChainDef[];
  private _selectedImageChain: ImageChainDef;

  private queueContent: Immutable.List<WordPaintTask>
  private currentPaintTask: WordPaintTask;
  private previousPhrase: string;

  private serviceSub: Subscription;
  private queueSub: Subscription;
  private taskSub: Subscription;

  private progressMode: string = "determinate";
  private pctBuffer: number = 0;
  private pctDone: number = 0;

  @ViewChildren("canvas[paintable]") private canvasRef: PaintableDirective;

  private paintSize: Dimensions = {
    pixelWidth: 480,
    pixelHeight: 480
  };
  private paintSizeSubject: BehaviorSubject<Dimensions>;
  private paintProgress: Subject<PaintProgress> = new Subject<PaintProgress>();

  private uploadSubscription: Subscription;

  constructor(
    private readonly activatedRoute: ActivatedRoute, private readonly artworkApi: ArtworkApi,
    private readonly pointService: PointMappingService,
    private readonly phraseGenerator: PhraseGeneratorService,
    private readonly imageStore: ImageStoreService,
    private readonly paintQueue: WordPaintQueueService,
    private readonly navbarDataService: NavbarDataService
  ) {
    this.paintSizeSubject =
      new BehaviorSubject<Dimensions>(this.paintSize);
  }

  public ngOnInit() {
    let snapshot = this.activatedRoute.snapshot;
    this.allImageChains = snapshot.data['imageChainDef'];
    this._selectedImageChain = this.allImageChains[0];

    // let obsChains = snapshot.data['imageChainDef'];
    // let subscription = obsChains.subscribe((values: ImageChainDef[]) => {
    //   this.allImageChains = values;
    //   console.log(JSON.stringify(values));
    //   this._selectedImageChain = this.allImageChains[0];
    // }, (err: any) => { console.error(err); }, () => { console.log("Shutting down"); });

    let numRounds = 0;
    while ((this.paintQueue.count() < MIN_QUEUE_SIZE) && (numRounds++ < MIN_QUEUE_SIZE)) {
      this.scheduleNext();
    }

    this.queueSub = this.paintQueue.onChanged()
      .subscribe((event: QueueChange<WordPaintTask>) => {
        switch (event.kind) {
          case 'offer':
            this.queueContent = event.newContent;
            if ((!this.currentPaintTask) && (this.pointService.stage
              === ServiceStage.available)) {
              this.beginPainting();
            }
            break;
          case 'take':
          case 'create':
          case 'remove':
          case 'replace':
          case 'swap':
          default:
            this.queueContent = event.newContent;
            break;
        }

        while (this.queueContent.size < MIN_QUEUE_SIZE) {
          this.scheduleNext();
        }
      }, (err: any) => { console.error(err); },
        () => { this.queueSub = undefined; });

    this.serviceSub = this.pointService.events
      .subscribe((event: ServiceEventType) => {
        switch (event.kind) {
          case 'launched': {
            if (this.paintQueue && this.paintQueue.count() > 0) {
              this.beginPainting();
            }
            break;
          }
          default:
            console.log('Nothing for' + JSON.stringify(event));
            break;
        }
      }, (err: any) => { console.error(err); },
        () => { this.serviceSub = undefined; });

    console.log("Editting Image Lab menu item");
    this.navbarDataService.updateNavbar((builder: NavbarDataModelBuilder) => {
      builder.resetTabs()
        .editMenuNav('Image Lab', (builder: MenuNavDataModelBuilder) => {
          builder.disabled(true)
        });
    })
  }

  public ngOnDestroy() {
    if (this.serviceSub) {
      this.serviceSub.unsubscribe();
    }

    this.navbarDataService.updateNavbar((builder: NavbarDataModelBuilder) => {
      builder.editMenuNav('Image Lab', (builder: MenuNavDataModelBuilder) => {
        builder.disabled(false)
      });
    });
  }

  public ngAfterViewInit() {
    // this.wordPaintCanvas.isReady();
  }

  get phraseToPaint(): string {
    let retVal: string;

    if (this.paintQueue.count() >= 1) {
      retVal = this.paintQueue.peek().phrase;
    }

    return retVal;
  }

  get hasPainted(): boolean {
    return _.isString(this.previousPhrase);
  }

  get isPainting(): boolean {
    return this.currentPaintTask instanceof Object;
  }

  get willPaint(): boolean {
    return !this.isPainting && (this.paintQueue.count() > 0);
  }

  private get selectedImageChain(): ImageChainDef {
    return this._selectedImageChain;
  }

  private set selectedImageChain(data: ImageChainDef) {
    this._selectedImageChain = data;
  }

  public renameNext() {
    if (this.paintQueue.count() > 0) {
      let rawTask: WordPaintTask = WordPaintTask.build((builder) => {
        builder.phrase(
          this.phraseGenerator.createNextPhrase()
        ).chain(
          this.paintQueue.peek().chain
        )
      });

      const newItem = this.pointService.prepareTask(rawTask);
      this.paintQueue.replace(0, newItem);
    } else {
      console.error("Cannot replace next item--queue is already empty!");
    }
  }

  public scheduleNext() {
    let rawTask: WordPaintTask = WordPaintTask.build((builder) => {
      builder.phrase(
        this.phraseGenerator.createNextPhrase()
      ).chain(this.selectedImageChain)
    });

    const newItem = this.pointService.prepareTask(rawTask);
    this.paintQueue.offer(newItem);
  }

  public beginPainting() {
    if (this.paintQueue.count() > 0) {
      this.currentPaintTask = this.paintQueue.take();
      this.taskSub = this.currentPaintTask.events.subscribe(
        (event: TaskEventType<string, PaintProgress, string>) => {
          switch (event.kind) {
            case 'began':
              this.onWordPaintBegin(event);
              break;
            case 'progress':
              this.onWordPaintProgress(event);
              break;
            case 'acknowledged':
              this.onWordPaintAcknowledged(event);
              break;
            case 'finished':
              this.onWordPaintDone(event);
              break;
            case 'cancelled':
              this.onWordPaintCancelled(event);
              break;
            case 'hardError':
              this.onWordPaintHardError(event);
              break;
            case 'softError':
              this.onWordPaintSoftError(event);
              break;
            default:
              console.log(event);
          }
        }, (err: any) => { console.error(err); }, () => {this.taskSub = undefined; });
      this.currentPaintTask.begin();
    } else {
      console.error("Cannot paint next item--queuee is already empty!");
    }
  }

  public cancelPainting() {
    this.currentPaintTask.cancel();
  }

  //
  // Event Handlers for compopnentized wordpaint canvas TODO
  //

  public onWordPaintBegin(event: BeganTaskEvent<string,PaintProgress,string>) {
    this.paintSize = {
      pixelWidth: this.currentPaintTask.chain.pixelWidth,
      pixelHeight: this.currentPaintTask.chain.pixelHeight
    };
  }

  public onWordPaintProgress(event: ProgressTaskEvent<string,PaintProgress,string>) {
    // this.wordPaintCanvas.paint(event.progress.paintPoints);
    this.paintProgress.next(event.progress);
    console.log(`Progress update TODO for ${event.task} at ${event.progress.pctDone}!`);
    this.pctBuffer = (event.progress.pctDone * 2) - this.pctDone;
    this.pctDone = event.progress.pctDone;
  }

  public onWordPaintSoftError(event: SoftErrorTaskEvent<string,PaintProgress,string>) {
    this.currentPaintTask.acknowledge();
    this.scheduleNext();
  }

  public onWordPaintHardError(event: HardErrorTaskEvent<string,PaintProgress,string>) {
    this.currentPaintTask.acknowledge();
    this.scheduleNext();
  }

  public onWordPaintCancelled(event: CancelledTaskEvent<string,PaintProgress,string>) {
    this.currentPaintTask.acknowledge();
    this.scheduleNext();
  }

  public onWordPaintDone(event: FinishedTaskEvent<string,PaintProgress,string>) {
    let completedPhrase = event.task;
    let fullImageDataUrl = this.canvasRef.dataUrl
    let imageDataUrl =
      fullImageDataUrl.replace(/^data:image\/(png|jpeg|jpg|gif);base64,/, '');

    // TODO: Try using the toBlob() method instead of this hackish looking snippet
    // let base64Data: string = canvas.toDataURL('image/png')
    let imageData: Blob = base64toBlob(imageDataUrl, 'image/png');

    this.scheduleNext();

    const result: Observable<any> = this.artworkApi.upload(
      completedPhrase, this.currentPaintTask.chain.pixelWidth,
      this.currentPaintTask.chain.pixelHeight, imageDataUrl);

    this.uploadSubscription = result.subscribe((data) => {
      this.uploadSubscription.unsubscribe();
      this.currentPaintTask.acknowledge();
      // TODO: Insert to local image store.
    }, (err) => { console.error(err); }, () => { this.uploadSubscription = null});
  }

  public onWordPaintAcknowledged(
    event: AcknowledgedTaskEvent<string,PaintProgress,string>) {
    this.taskSub.unsubscribe();
    this.taskSub = undefined;
    this.currentPaintTask = undefined;
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
