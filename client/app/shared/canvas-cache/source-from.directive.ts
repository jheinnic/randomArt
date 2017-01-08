import {
  Directive, OnDestroy, OnInit, Input, ElementRef, ViewChild, ContentChild, AfterContentInit
} from "@angular/core";
import {DurableCanvasService} from "./durable-canvas.service";
import {DurableCanvasRef} from "./durable-canvas-ref.datamodel";

/**
 * Created by jheinnic on 1/5/17.
 */

@Directive({
  selector: 'video[source-from]'
})
export class SourceFromDirective implements OnInit, AfterContentInit, OnDestroy {
  @Input() private cacheId: string;
  @ContentChild('video') canvasElement: ElementRef;

  private cacheRef: DurableCanvasRef;

  constructor(private readonly cacheService: DurableCanvasService) { }

  public ngOnInit() {
    this.cacheRef = this.cacheService.getOrCreate(this.cacheId);
  }

  public ngAfterContentInit() {
    let contentVideo: HTMLVideoElement = this.canvasElement.nativeElement;
    let mediaStream: MediaStream = this.cacheRef.mediaStream;
    contentVideo.srcObject = mediaStream;
  }

  public ngOnDestroy() {
    this.cacheRef.release();
  }
}
