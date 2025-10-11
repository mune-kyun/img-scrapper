import { Page } from 'puppeteer';
import { GetImageDetailsProps, GetImageDetailsStrategyEnum, ImageInfo } from '@/type';

export const getImageDetails = async (page: Page, props: GetImageDetailsProps): Promise<ImageInfo[]> => {
  const { strategy = GetImageDetailsStrategyEnum.IMG_SRC } = props;
  
  if (strategy === GetImageDetailsStrategyEnum.A_HREF) {
    return await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a'));
      const imageInfos = new Array<ImageInfo>();

      anchors.forEach(anchor => {
        const href = anchor.href;
        if (href && href.startsWith('http') && href.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) {
          imageInfos.push({
            src: href,
            alt: anchor.textContent || undefined,
            width: undefined,
            height: undefined
          });
        }
      });

      return imageInfos;
    });
  } else {
    return await page.evaluate(() => {
      // TODO: needs to be tested typeshit cuz currently we havent taken account for this strat
      const images = Array.from(document.querySelectorAll('img'));
      return images.map(img => ({
        src: img?.src || '',
        alt: img?.alt || undefined,
        width: img?.naturalWidth && img.naturalWidth > 0 ? img.naturalWidth : undefined,
        height: img?.naturalHeight && img.naturalHeight > 0 ? img.naturalHeight : undefined
      })).filter(info => info.src && info.src.startsWith('http'));
    });
  }
};