import { Page } from "puppeteer";

export interface ImageInfo {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface ScrapeOptions {
  timeout?: number;
  waitForImages?: boolean;
  scrollToLoad?: boolean;
  scrollDelay?: number;
  minWidth?: number;
  minHeight?: number;
  removeDuplicates?: boolean;
}

export interface ScrapeResult {
  images: ImageInfo[];
  totalFound: number;
  url: string;
  timestamp: Date;
}

export interface ScrapperConfig {
  headless?: boolean;
  timeout?: number;
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

// State Machine related types

export enum StateEnum {
  NAVIGATE = "navigate",
  NAVIGATE_DETAIL = "navigateDetail",
  DOWNLOAD_IMAGE = "downloadImage",
  DOWNLOAD_IMAGE_LIST = "downloadImageList",
  FINISH = "finish",
}

export type StateType = 
  typeof StateEnum.NAVIGATE 
  | typeof StateEnum.NAVIGATE_DETAIL
  | typeof StateEnum.DOWNLOAD_IMAGE
  | typeof StateEnum.DOWNLOAD_IMAGE_LIST
  | typeof StateEnum.FINISH
;

export interface StateContext {}

export interface NavigateStateContext extends StateContext {
  page: Page;
  url: string;
  shouldScrollToLoad?: boolean;
  scrollProps?: ScrollProps;
}

export interface DownloadImageListStateContext extends StateContext {
  images: ImageInfo[];
}

export enum GetImageDetailsStrategyEnum {
  A_HREF = "a_href",
  IMG_SRC = "img_src ",
}

export interface GetImageDetailsProps {
  strategy?: GetImageDetailsStrategyEnum;
}