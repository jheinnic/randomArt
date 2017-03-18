/**
 * Created by jheinnic on 1/2/17.
 */
import {
  Component, ViewChild, AfterViewInit, OnInit, OnDestroy, ElementRef, ViewChildren
} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {NavbarDataService, NavbarDataModelBuilder, MenuNavDataModelBuilder } from "../app-root";
import {ReflectiveFluentBuilder} from "../../../common/lib/datamodel-ts/index";
import {PhraseGeneratorService} from "../shared/phrase-generator/phrase-generator.service";
import {PaintableDirective} from "../shared/canvas-util/paintable.directive";
import {ArtworkApi} from "../shared/sdk/services/custom/Artwork";
import {RealTime} from "../shared/sdk/services/core/real.time";
import {FireLoopRef} from "../shared/sdk/models/FireLoopRef";
import {Pool} from "../shared/sdk/models/Pool";
import {ImageChain} from "../shared/sdk/models/ImageChain";
import {QueueChange} from "../shared/service-util/abstract-queue.service";
import {ServiceEventType} from "../shared/service-util/service-lifecycle.datamodel";
import {
  TaskEvent, ProgressTaskEvent, FinishedTaskEvent, HardErrorTaskEvent,
  SoftErrorTaskEvent, CancelledTaskEvent, AcknowledgedTaskEvent
} from "../shared/service-util/task-lifecycle.datamodel";
import {PointMappingService} from "./point-mapping.service";
import {WordPaintQueueService} from "./word-paint-queue.service";
import {WordPaintTask} from "./word-paint-task.class";
import {WordPaintInput} from "./word-paint-input.datamodel";
import {WordPaintResult} from "./word-paint-result.datamodel";
import {WordPaintProgress} from "./word-paint-progress.datamodel";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import Immutable = require('immutable');
import uuid = require('uuid');
import _ = require('lodash');


const MIN_QUEUE_SIZE: number = 8;
// const MAX_BUFFER_SIZE: number = 2000;
// const LIVE_LATENCY: number = 600;


@Component({
  moduleId: "client/app/pool/image-lobby.component",
  selector: "image-lobby",
  template: require("./_image-lobby.view.html"),
  styleUrls: ["./_image-lobby.scss"],

})
export class ImageLobbyComponent implements OnInit, AfterViewInit, OnDestroy
{
  private fireLoopRef: FireLoopRef<ImageChain>;
  private allImageChains: ImageChain[] = [];
  private selectedImageChain: ImageChain;
  private imageChainSubsn: Subscription;
  private rtSubscription: Subscription;

  private activePoolInst: Pool;
  private activePoolSubsn: Subscription;

  private queueContent: Immutable.List<WordPaintInput>;
  private currentPaintTask: WordPaintTask;
  private previousPaintTask: WordPaintTask;

  private serviceSub: Subscription;
  private queueSub: Subscription;
  private taskSub: Subscription;

  private progressMode: string = "determinate";
  private pctBuffer: number = 0;
  private pctDone: number = 0;

  @ViewChild(PaintableDirective) private baseCanvasRef: ElementRef; //PaintableDirective;
  private canvasRef: PaintableDirective;
  private uploadSubscription: Subscription;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly artworkApi: ArtworkApi,
    private readonly realTime: RealTime,
    private readonly pointService: PointMappingService,
    private readonly phraseGenerator: PhraseGeneratorService,
    private readonly paintQueue: WordPaintQueueService,
    private readonly navbarDataService: NavbarDataService
  ) {
    console.log('ImageLobby Constructor');

    this.rtSubscription = this.realTime.onReady().subscribe(
      () => {
        this.fireLoopRef = this.realTime.FireLoop
          .ref<ImageChain>(ImageChain);
        this.imageChainSubsn =
          this.fireLoopRef.on("change", {
            offset: 0,
            order: "pixelCount ASC, pixelHeight ASC, pixelWidth ASC"
          }).subscribe(
            (newData:ImageChain[]) => {
              this.allImageChains = newData;
              this.selectedImageChain = newData[0];
            },
            (err:any) => {
              console.error(err);
              this.imageChainSubsn.unsubscribe();
            },
            () => {
              this.imageChainSubsn = undefined;
            }
          );
      },
      (err:any) => {
        console.error(err);
        this.rtSubscription.unsubscribe();
      },
      () => { this.rtSubscription = undefined; }
    );
  }

  public ngOnInit() {
    let snapshot = this.activatedRoute.snapshot;
    // TODO!!
    // this.activePoolSubsn = snapshot.data['activePoolInst']
    //   .subscribe(
    //     (data) => {this.activePoolInst = data;},
    //     (err) => {console.error(err); this.activePoolSubsn.unsubscribe()},
    //     () => {this.activePoolSubsn = undefined;}
    //   );

    console.log("Editting Image Lab menu item");
    this.navbarDataService.updateNavbar((builder: NavbarDataModelBuilder) => {
      builder.resetTabs()
        .editMenuNav('Image Pools', (builder: MenuNavDataModelBuilder) => {
          builder.disabled(true)
        });
    });
  }

  public ngAfterViewInit() {
    console.log(this.baseCanvasRef);
    if (this.baseCanvasRef) {
      this.canvasRef = this.baseCanvasRef.nativeElement;
    } else {
      throw new Error("Failed to find paintableCanvas directive in image lobby template!?");
    }

    this.queueSub = this.paintQueue.onChanged()
      .subscribe((event: QueueChange<WordPaintInput>) => {
        switch (event.kind) {
          case 'offer':
            this.queueContent = event.newContent;
            if ((!this.currentPaintTask) && this.pointService.isAvailable()) {
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

    while (this.paintQueue.count() < MIN_QUEUE_SIZE) {
      this.scheduleNext();
    }

    this.serviceSub = this.pointService.events
      .subscribe((event: ServiceEventType) => {
        switch (event.kind) {
          case 'launched': {
            if (this.paintQueue && (this.paintQueue.count() > 0)) {
              this.beginPainting();
            }
            break;
          }
          default:
            console.log('Nothing for' + JSON.stringify(event));
            break;
        }
      }, (err: any) => { console.error(err); this.serviceSub.unsubscribe(); },
        () => { this.serviceSub = undefined; });
  }

  public ngOnDestroy() {
    if (this.serviceSub) {
      this.serviceSub.unsubscribe();
    }

    if (this.queueSub) {
      this.queueSub.unsubscribe();
    }

    if (this.activePoolSubsn) {
      this.activePoolSubsn.unsubscribe();
    }

    if (this.imageChainSubsn) {
      this.imageChainSubsn.unsubscribe();
    }

    if (this.fireLoopRef) {
      this.fireLoopRef.dispose();
    }

    this.navbarDataService.updateNavbar((builder: NavbarDataModelBuilder) => {
      builder.editMenuNav('Image Pools', (builder: MenuNavDataModelBuilder) => {
        builder.disabled(false)
      });
    });
  }

  get phraseToPaint(): string {
    let retVal: string;

    if (this.paintQueue.count() >= 1) {
      retVal = this.paintQueue.peek().phrase;
    }

    return retVal;
  }

  get hasPainted(): boolean {
    return !!this.previousPaintTask;
  }

  get isPainting(): boolean {
    return this.currentPaintTask instanceof Object;
  }

  get willPaint(): boolean {
    return !this.isPainting && (this.paintQueue.count() > 0);
  }

  public renameNext() {
    if (this.paintQueue.count() > 0) {
      let rawTask: WordPaintInput = this.paintQueue.peek();

      let newTask: WordPaintInput = rawTask.copy(
        (builder: ReflectiveFluentBuilder<WordPaintInput>) => {
          builder.phrase(
            this.phraseGenerator.createNextPhrase()
          ).chain(this.selectedImageChain)
        }
      );

      this.paintQueue.replace(0, newTask);
    } else {
      console.error("Cannot replace next item--queue is already empty!");
    }
  }

  public scheduleNext() {
    this.paintQueue.offer(
    WordPaintInput.build(
      (builder: ReflectiveFluentBuilder<WordPaintInput>) => {
        builder.phrase(
          this.phraseGenerator.createNextPhrase()
        ).chain(this.selectedImageChain)
      })
    );
  }

  public beginPainting() {
    if (this.paintQueue.count() > 0) {
      const rawTask = this.paintQueue.take();
      this.currentPaintTask = this.pointService.prepareTask(rawTask, this.canvasRef);
      this.canvasRef.subscribeTo(this.currentPaintTask.events);
      this.taskSub = this.currentPaintTask.events.subscribe(
        (event: TaskEvent<WordPaintInput,WordPaintProgress,WordPaintResult>) => {
          switch (event.kind) {
            // case 'began':
            //   this.onWordPaintBegin(event);
            //   break;
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
      console.error("Cannot paint next item--queue is empty?!");
    }
  }

  public cancelPainting() {
    this.currentPaintTask.cancel();
  }

  //
  // Event Handlers for compopnentized wordpaint canvas TODO
  //

  // public onWordPaintBegin(event: BeganTaskEvent<WordPaintInput,WordPaintProgress,WordPaintResult>) {
  // }

  private onWordPaintProgress(event: ProgressTaskEvent<WordPaintInput,WordPaintProgress,WordPaintResult>) {
    // this.wordPaintCanvas.paint(event.progress.paintPoints);
    // this.paintProgress.next(event.progress);
    console.log(`Progress update TODO for ${event.task} at ${event.progress.pctDone}!`);
    this.pctBuffer = (event.progress.pctDone * 2) - this.pctDone;
    this.pctDone = event.progress.pctDone;
  }

  private onWordPaintSoftError(event: SoftErrorTaskEvent<WordPaintInput,WordPaintProgress,WordPaintResult>) {
    this.currentPaintTask.acknowledge();
    this.scheduleNext();
  }

  private onWordPaintHardError(event: HardErrorTaskEvent<WordPaintInput,WordPaintProgress,WordPaintResult>) {
    this.currentPaintTask.acknowledge();
    this.scheduleNext();
  }

  private onWordPaintCancelled(event: CancelledTaskEvent<WordPaintInput,WordPaintProgress,WordPaintResult>) {
    this.currentPaintTask.acknowledge();
    this.scheduleNext();
  }

  private onWordPaintDone(event: FinishedTaskEvent<WordPaintInput,WordPaintProgress,WordPaintResult>) {
    let completedPhrase = event.task;
    let fullImageDataUrl = this.canvasRef.dataUrl;
    let imageDataUrl =
      fullImageDataUrl.replace(/^data:image\/(png|jpeg|jpg|gif);base64,/, '');

    // TODO: Try using the toBlob() method instead of this hackish looking snippet
    // let base64Data: string = canvas.toDataURL('image/png')
    let imageData: Blob = base64toBlob(imageDataUrl, 'image/png');

    this.scheduleNext();

    const result: Observable<any> = this.artworkApi.upload(
      completedPhrase, this.currentPaintTask.input.chain.pixelWidth,
      this.currentPaintTask.input.chain.pixelHeight, imageDataUrl);

    this.uploadSubscription = result.subscribe((data) => {
      this.uploadSubscription.unsubscribe();
      this.currentPaintTask.acknowledge();
      // TODO: Insert to local image store.
    }, (err) => { console.error(err); }, () => { this.uploadSubscription = null});
  }

  private onWordPaintAcknowledged(
    event: AcknowledgedTaskEvent<WordPaintInput,WordPaintProgress,WordPaintResult>
  ) {
    this.taskSub.unsubscribe();
    this.taskSub = undefined;
    this.previousPaintTask = this.currentPaintTask;
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
