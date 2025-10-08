export interface ImageInfo {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface ScrapperConfig {
  headless?: boolean;
  timeout?: number;
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