"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by jheinnic on 1/2/17.
 */
var core_1 = require("@angular/core");
var paintable_directive_1 = require("../shared/canvas-util/paintable.directive");
var word_paint_input_datamodel_1 = require("./word-paint-input.datamodel");
var MIN_QUEUE_SIZE = 8;
// const MAX_BUFFER_SIZE: number = 2000;
// const LIVE_LATENCY: number = 600;
var ImageLobbyComponent = (function () {
    function ImageLobbyComponent(activatedRoute, artworkApi, pointService, phraseGenerator, paintQueue, navbarDataService) {
        this.activatedRoute = activatedRoute;
        this.artworkApi = artworkApi;
        this.pointService = pointService;
        this.phraseGenerator = phraseGenerator;
        this.paintQueue = paintQueue;
        this.navbarDataService = navbarDataService;
        this.progressMode = "determinate";
        this.pctBuffer = 0;
        this.pctDone = 0;
        // this.paintSize = { pixelWidth: 480, pixelHeight: 480 };
        // this.paintSizeSubject =
        //   new BehaviorSubject<Dimensions>(this.paintSize);
        // this.paintProgress = new Subject<PaintProgress>();
    }
    ImageLobbyComponent.prototype.ngOnInit = function () {
        var _this = this;
        var snapshot = this.activatedRoute.snapshot;
        this.allImageChains = snapshot.data['imageChainDef'];
        this.activePoolSubsn = snapshot.data['activePoolInst']
            .subscribe(function (data) { _this.activePoolInst = data; }, function (err) { console.error(err); }, function () { _this.activePoolSubsn = undefined; });
        // let obsChains = snapshot.data['imageChainDef'];
        // let subscription = obsChains.subscribe((values: ImageChainDef[]) => {
        //   this.allImageChains = values;
        //   console.log(JSON.stringify(values));
        //   this.mySelectedImageChain = this.allImageChains[0];
        // }, (err: any) => { console.error(err); }, () => { console.log("Shutting down"); });
        while (this.paintQueue.count() < MIN_QUEUE_SIZE) {
            this.scheduleNext();
        }
        this.queueSub = this.paintQueue.onChanged()
            .subscribe(function (event) {
            switch (event.kind) {
                case 'offer':
                    _this.queueContent = event.newContent;
                    if ((!_this.currentPaintTask) && _this.pointService.isAvailable()) {
                        _this.beginPainting();
                    }
                    break;
                case 'take':
                case 'create':
                case 'remove':
                case 'replace':
                case 'swap':
                default:
                    _this.queueContent = event.newContent;
                    break;
            }
            while (_this.queueContent.size < MIN_QUEUE_SIZE) {
                _this.scheduleNext();
            }
        }, function (err) { console.error(err); }, function () { _this.queueSub = undefined; });
        this.serviceSub = this.pointService.events
            .subscribe(function (event) {
            switch (event.kind) {
                case 'launched': {
                    if (_this.paintQueue && (_this.paintQueue.count() > 0)) {
                        _this.beginPainting();
                    }
                    break;
                }
                default:
                    console.log('Nothing for' + JSON.stringify(event));
                    break;
            }
        }, function (err) { console.error(err); }, function () { _this.serviceSub = undefined; });
        console.log("Editting Image Lab menu item");
        this.navbarDataService.updateNavbar(function (builder) {
            builder.resetTabs()
                .editMenuNav('Image Lab', function (builder) {
                builder.disabled(true);
            });
        });
    };
    ImageLobbyComponent.prototype.ngOnDestroy = function () {
        if (this.serviceSub) {
            this.serviceSub.unsubscribe();
        }
        this.navbarDataService.updateNavbar(function (builder) {
            builder.editMenuNav('Image Lab', function (builder) {
                builder.disabled(false);
            });
        });
    };
    ImageLobbyComponent.prototype.ngAfterViewInit = function () {
        // this.wordPaintCanvas.isReady();
    };
    Object.defineProperty(ImageLobbyComponent.prototype, "phraseToPaint", {
        get: function () {
            var retVal;
            if (this.paintQueue.count() >= 1) {
                retVal = this.paintQueue.peek().phrase;
            }
            return retVal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageLobbyComponent.prototype, "hasPainted", {
        get: function () {
            return !!this.previousPaintTask;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageLobbyComponent.prototype, "isPainting", {
        get: function () {
            return this.currentPaintTask instanceof Object;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageLobbyComponent.prototype, "willPaint", {
        get: function () {
            return !this.isPainting && (this.paintQueue.count() > 0);
        },
        enumerable: true,
        configurable: true
    });
    ImageLobbyComponent.prototype.renameNext = function () {
        var _this = this;
        if (this.paintQueue.count() > 0) {
            var rawTask = this.paintQueue.peek();
            var newTask = rawTask.copy(function (builder) {
                builder.phrase(_this.phraseGenerator.createNextPhrase());
            });
            this.paintQueue.replace(0, newTask);
        }
        else {
            console.error("Cannot replace next item--queue is already empty!");
        }
    };
    ImageLobbyComponent.prototype.scheduleNext = function () {
        var _this = this;
        this.paintQueue.offer(word_paint_input_datamodel_1.WordPaintInput.build(function (builder) {
            builder.phrase(_this.phraseGenerator.createNextPhrase()).chain(_this.selectedImageChain);
        }));
    };
    ImageLobbyComponent.prototype.beginPainting = function () {
        var _this = this;
        if (this.paintQueue.count() > 0) {
            var rawTask = this.paintQueue.take();
            this.currentPaintTask = this.pointService.prepareTask(rawTask, this.canvasRef);
            this.canvasRef.subscribeTo(this.currentPaintTask.events);
            this.taskSub = this.currentPaintTask.events.subscribe(function (event) {
                switch (event.kind) {
                    // case 'began':
                    //   this.onWordPaintBegin(event);
                    //   break;
                    case 'progress':
                        _this.onWordPaintProgress(event);
                        break;
                    case 'acknowledged':
                        _this.onWordPaintAcknowledged(event);
                        break;
                    case 'finished':
                        _this.onWordPaintDone(event);
                        break;
                    case 'cancelled':
                        _this.onWordPaintCancelled(event);
                        break;
                    case 'hardError':
                        _this.onWordPaintHardError(event);
                        break;
                    case 'softError':
                        _this.onWordPaintSoftError(event);
                        break;
                    default:
                        console.log(event);
                }
            }, function (err) { console.error(err); }, function () { _this.taskSub = undefined; });
            this.currentPaintTask.begin();
        }
        else {
            console.error("Cannot paint next item--queue is empty?!");
        }
    };
    ImageLobbyComponent.prototype.cancelPainting = function () {
        this.currentPaintTask.cancel();
    };
    //
    // Event Handlers for compopnentized wordpaint canvas TODO
    //
    // public onWordPaintBegin(event: BeganTaskEvent<WordPaintInput,WordPaintProgress,WordPaintResult>) {
    // }
    ImageLobbyComponent.prototype.onWordPaintProgress = function (event) {
        // this.wordPaintCanvas.paint(event.progress.paintPoints);
        // this.paintProgress.next(event.progress);
        console.log("Progress update TODO for " + event.task + " at " + event.progress.pctDone + "!");
        this.pctBuffer = (event.progress.pctDone * 2) - this.pctDone;
        this.pctDone = event.progress.pctDone;
    };
    ImageLobbyComponent.prototype.onWordPaintSoftError = function (event) {
        this.currentPaintTask.acknowledge();
        this.scheduleNext();
    };
    ImageLobbyComponent.prototype.onWordPaintHardError = function (event) {
        this.currentPaintTask.acknowledge();
        this.scheduleNext();
    };
    ImageLobbyComponent.prototype.onWordPaintCancelled = function (event) {
        this.currentPaintTask.acknowledge();
        this.scheduleNext();
    };
    ImageLobbyComponent.prototype.onWordPaintDone = function (event) {
        var _this = this;
        var completedPhrase = event.task;
        var fullImageDataUrl = this.canvasRef.dataUrl;
        var imageDataUrl = fullImageDataUrl.replace(/^data:image\/(png|jpeg|jpg|gif);base64,/, '');
        // TODO: Try using the toBlob() method instead of this hackish looking snippet
        // let base64Data: string = canvas.toDataURL('image/png')
        var imageData = base64toBlob(imageDataUrl, 'image/png');
        this.scheduleNext();
        var result = this.artworkApi.upload(completedPhrase, this.currentPaintTask.input.chain.pixelWidth, this.currentPaintTask.input.chain.pixelHeight, imageDataUrl);
        this.uploadSubscription = result.subscribe(function (data) {
            _this.uploadSubscription.unsubscribe();
            _this.currentPaintTask.acknowledge();
            // TODO: Insert to local image store.
        }, function (err) { console.error(err); }, function () { _this.uploadSubscription = null; });
    };
    ImageLobbyComponent.prototype.onWordPaintAcknowledged = function (event) {
        this.taskSub.unsubscribe();
        this.taskSub = undefined;
        this.previousPaintTask = this.currentPaintTask;
        this.currentPaintTask = undefined;
    };
    return ImageLobbyComponent;
}());
__decorate([
    core_1.ViewChildren(paintable_directive_1.PaintableDirective)
], ImageLobbyComponent.prototype, "canvasRef", void 0);
ImageLobbyComponent = __decorate([
    core_1.Component({
        moduleId: "./app/pool",
        selector: "image-lobby",
        template: require("./_image-lobby.view.html"),
        styleUrls: ["./_image-lobby.scss"],
    })
], ImageLobbyComponent);
exports.ImageLobbyComponent = ImageLobbyComponent;
/**
 * Converts a base64 string to byte array.
 */
function base64toBlob(base64Data, contentType, sliceSize) {
    if (contentType === void 0) { contentType = ''; }
    if (sliceSize === void 0) { sliceSize = 512; }
    var byteCharacters = atob(base64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
}
