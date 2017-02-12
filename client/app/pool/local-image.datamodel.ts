/**
 * Created by jheinnic on 1/18/17.
 */

import {Partial} from "../../../common/lib/datamodel-ts";
import builder = require('fluent-interface-builder');
import Immutable = require('immutable');

export class ImageSubmission
{
  uuid: string;
  version: number;
  title: string;
  size: number;
  url: string;
  origin: string;
  localChainId: number;
  createdAt: number;
  modifiedAt: number;

  constructor(template: Partial<ImageSubmission>) {
    Object.assign(this, template);
  }
}

export class AuthenticityDigest {
  seq: number;
  version: number;
  imageUuid: string;
  localChainId: number;
  digest: string;
  createdAt: number;
  modifiedAt: number;

  constructor(template: Partial<AuthenticityDigest>) {
    Object.assign(this, template);
  }
}

export class MerkleMountainNode {
  compIndex: number;
  version: number;
  localImageChainId: number;
  depthLevel: number;
  factorIndex: number;
  digest: string;
  createdAt: number;
  modifiedAt: number;

  constructor(template: Partial<MerkleMountainNode>) {
    Object.assign(this, template);
  }
}

export class ChainLengthTracker {
  uuid: number;
  version: number;
  latestSeqId: number;
  createdAt: number;
  modifiedAt: number;

  constructor(template: Partial<ChainLengthTracker>) {
    Object.assign(this, template);
  }
}

export class LocalImageRef
{
  localImageId: number;
  imageUuid: string;
  localChainId: number;
  inCache: boolean;
  isFavorite: boolean;
  selfGenerated: boolean;

  constructor(template: Partial<LocalImageRef>) {
    Object.assign(this, template);
  }
}

export class PeerContentInstance
{
  localPeerId: number;
  localImageId: number;

  constructor(template: Partial<PeerContentInstance>) {
    Object.assign(this, template);
  }
}

export class KnownPeer {
  localPeerid: number
  latestPeerUuid: string;
  userIdentity: string;

  constructor(template: Partial<KnownPeer>) {
    Object.assign(this, template);
  }
}

export class CachedImage {
  localImageId: number;
  base64Data: string;

  constructor(template: Partial<CachedImage>) {
    Object.assign(this, template);
  }
}


export class CacheAccessEvent
{
  recordId: number;
  localImageId: number;
  localPeerId: number;
  eventDate: number;
  eventType: string;

  constructor(template: Partial<CacheAccessEvent>) {
    Object.assign(this, template);
  }
}

export class PeerGossipEvent
{
  recordId: number;
  localPeerId: number;
  contactType: number;
  contactedAt: number;

  constructor(template: Partial<PeerGossipEvent>) {
    Object.assign(this, template);
  }
}

export class VibrantPallette
{
  scanId: number;
  localImageId: number;
  colorIndex: number;

  constructor(template: Partial<VibrantPallette>) {
    Object.assign(this, template);
  }
}

export class VibrantColor
{
  recordId: number;
  localImageId: number;
  colorIndex: number;
  rgbCode: string;

  constructor(template: Partial<VibrantColor>) {
    Object.assign(this, template);
  }
}

  export class SimilarityTest
  {
    recordId: number;
    localTestId: number;
    localImageId: number
  }

  export class SimilarityTestResult
  {
    localTestId: number;
    similarityScore: number;
    testedAt: number;
  }
