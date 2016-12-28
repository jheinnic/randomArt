/**
 * Created by jheinnic on 12/26/16.
 */
import {OpaqueToken} from "@angular/core";

export const WORD_PAINT_ON_BEGIN_EVENT_NAME: string =
  "org.jchein.portfolio.wordpaint.onComplete";

export const WORD_PAINT_ON_BEGIN_EVENT_ID: OpaqueToken =
  new OpaqueToken(WORD_PAINT_ON_BEGIN_EVENT_NAME);

export const WordPaintOnBeginEventName: any = {
  provide: WORD_PAINT_ON_BEGIN_EVENT_ID,
  useValue: WORD_PAINT_ON_BEGIN_EVENT_NAME
};


export const WORD_PAINT_ON_COMPLETE_EVENT_NAME: string =
  "org.jchein.portfolio.wordpaint.onComplete";

export const WORD_PAINT_ON_COMPLETE_EVENT_ID: OpaqueToken =
  new OpaqueToken(WORD_PAINT_ON_COMPLETE_EVENT_NAME);

export const WordPaintOnCompleteEventName: any = {
  provide: WORD_PAINT_ON_COMPLETE_EVENT_ID,
  useValue: WORD_PAINT_ON_COMPLETE_EVENT_NAME
};


export const WORD_PAINT_ON_CANCEL_EVENT_NAME: string =
  "org.jchein.portfolio.wordpaint.onCancel";

export const WORD_PAINT_ON_CANCEL_EVENT_ID: OpaqueToken =
  new OpaqueToken(WORD_PAINT_ON_CANCEL_EVENT_NAME);

export const WordPaintOnCancelEventName: any = {
  provide: WORD_PAINT_ON_CANCEL_EVENT_ID,
  useValue: WORD_PAINT_ON_CANCEL_EVENT_NAME
};
