export enum GetImageDetailsStrategyEnum {
  A_HREF = "a_href",
  IMG_SRC = "img_src ",
}

export interface GetImageDetailsProps {
  strategy?: GetImageDetailsStrategyEnum;
}

export enum ScrollStrategyTypeEnum {
  PX = "px",
  ELEMENT_ID = "element_id",
}

export interface ScrollStrategy {
  type: ScrollStrategyTypeEnum;
  elementId?: string; // required if type is ELEMENT_ID
}

export interface ScrollProps {
  scrollDelay?: number; // delay between scroll steps in ms
  scrollTimeout?: number; // max time to keep scrolling in ms
  scrollDistance?: number; // pixels per scroll step
  scrollMaxStagnantRetries?: number; // number of retries when no new content is loaded
  scrollStrategy?: ScrollStrategy; // strategy to use for scrolling
}