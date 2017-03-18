"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by jheinnic on 1/12/17.
 */
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var keys_dictionary_1 = require("./keys/keys.dictionary");
var ImageStoreService = (function () {
    function ImageStoreService(localStorage) {
        this.localStorage = localStorage;
        console.log("ImageStoreService constructor");
        this.imageChainDefs = localStorage.getItem(keys_dictionary_1.DIKeys.imageChainDefs);
        this.localImageRefs = localStorage.getItem(keys_dictionary_1.DIKeys.localImageRefs);
        this.cachedImages = localStorage.getItem(keys_dictionary_1.DIKeys.cachedImages);
        /*
        this.imageChainDef = this.webDb.createTable(ImageChainDef, 'imageChainDef', {
          localId: {
            type: Number,
            pk: true
          },
          version: {
            type: Number,
            version: true
          },
          uuid: {
            type: String,
            index: true,
            unique: true
          },
          displayName: {
            type: String,
            unique: true
          },
          widthIndices: String,
          heightIndices: String,
          pixelWidth: Number,
          pixelHeight: Number,
          createdAt: Number,
          modifiedAt: Number
        });
    
        this.imageSubmission = this.webDb.createTable(ImageSubmission, 'imageSubmission', {
          uuid: {
            type: String,
            pk: true
          },
          version: {
            type: Number,
            version: true
          },
          title: {
            type: String,
            index: true,
            unique: true
          },
          size: Number,
          url: String,
          origin: String,
          localChainId: {
            type: Number,
            fk: true,
            index: true
          },
          createdAt: Number,
          modifiedAt: Number
        });
    
        this.localImageRef = this.webDb.createTable(LocalImageRef, 'localImageRef', {
          localImageId: {
            type: Number,
            pk: true
          },
          imageUuid: {
            type: String,
            unique: true,
            index: true
          },
          localChainId: {
            type: String,
            fk: true
          },
          inCache: String, // Last three properties are
          isFavorite: String, // Boolean-encoded-as-String
          selfGenerated: String
        });
    
    
        this.cachedImage = this.webDb.createTable(CachedImage, 'cachedImage', {
          localImageId: { type: Number, pk: true },
          base64Data: String
        });
        */
    }
    ImageStoreService.prototype.getAllChainDefinitions = function () {
        return this.imageChainDefs;
    };
    ImageStoreService.prototype.save = function (chains) {
        var _this = this;
        var rollback = this.imageChainDefs;
        this.imageChainDefs = rxjs_1.Observable.of(chains);
        this.localStorage.setItem(keys_dictionary_1.DIKeys.imageChainDefs, chains).subscribe(function () { console.log('Success'); }, function (err) { console.error('Error! ' + err); _this.imageChainDefs = rollback; }, function () { console.log('Fin'); });
    };
    ImageStoreService.prototype.getAllLocalImagesRefs = function () {
        return this.localImageRefs;
    };
    ImageStoreService.prototype.saveLocalImage = function (refData, imgData) {
        var _this = this;
        this.localImageRefs.subscribe(function (data) {
            var newData;
            if (data) {
                newData = Array.from(data);
                newData.push(refData);
            }
            else {
                newData = Array.of(refData);
            }
            var rollback = _this.localImageRefs;
            _this.localImageRefs = rxjs_1.Observable.of(newData);
            _this.localStorage.setItem(keys_dictionary_1.DIKeys.localImageRefs, newData).subscribe(function () { console.log('Success'); }, function (err) { console.error('Error! ' + err); _this.localImageRefs = rollback; }, function () { console.log('Fin'); });
        });
        this.cachedImages.subscribe(function (data) {
            var newData;
            if (data) {
                newData = Array.from(data);
                newData.push(imgData);
            }
            else {
                newData = Array.of(imgData);
            }
            var rollback = _this.cachedImages;
            _this.cachedImages = rxjs_1.Observable.of(newData);
            _this.localStorage.setItem(keys_dictionary_1.DIKeys.cachedImages, newData).subscribe(function () { console.log('Success'); }, function (err) { console.error('Error! ' + err); _this.cachedImages = rollback; }, function () { console.log('Fin'); });
        });
    };
    return ImageStoreService;
}());
ImageStoreService = __decorate([
    core_1.Injectable()
], ImageStoreService);
exports.ImageStoreService = ImageStoreService;
