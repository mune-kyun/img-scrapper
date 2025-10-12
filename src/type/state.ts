import { Page } from "puppeteer";
import { ScrollProps } from "./task";
import { ImageInfo } from "./common";

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