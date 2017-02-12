import {OpaqueToken} from "@angular/core";

export interface DIKeys {
  createImagesMemento: OpaqueToken,
};

export const DIKeys = {
  createImagesMemento: new OpaqueToken("createImagesMemento"),

  localImageRefs: "info.jchein.portfolio.images.LocalImageRef",
  imageChainDefs: "info.jchein.portfolio.images.ImageChainDef",
  cachedImages: "info.jchein.portfolio.images.CachedImage",
}
