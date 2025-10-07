import { Page } from 'puppeteer';

export interface ImageInfo {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

/**
 * Wait for images to load on the page
 */
export const waitForImages = async (page: Page, timeout = 10000): Promise<void> => {
  await page.evaluate(async (timeoutMs) => {
    const images = Array.from(document.images);
    await Promise.all(
      images.map(img => {
        if (img.complete) return Promise.resolve();
        
        return new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            reject(new Error('Image load timeout'));
          }, timeoutMs);

          img.addEventListener('load', () => {
            clearTimeout(timer);
            resolve(undefined);
          });
          
          img.addEventListener('error', () => {
            clearTimeout(timer);
            resolve(undefined); // Don't reject on error, just resolve
          });
        });
      })
    );
  }, timeout);
};

/**
 * Get detailed image information
 */
export const getImageDetails = async (page: Page): Promise<ImageInfo[]> => {
  return await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images.map(img => ({
      src: img.src,
      alt: img.alt || undefined,
      width: img.naturalWidth || undefined,
      height: img.naturalHeight || undefined
    })).filter(info => info.src && info.src.startsWith('http'));
  });
};

/**
 * Scroll to load lazy-loaded images
 */
export const scrollToLoadImages = async (page: Page, scrollDelay = 1000): Promise<void> => {
  await page.evaluate(async (delay) => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, delay);
    });
  }, scrollDelay);
};

/**
 * Filter images by minimum dimensions
 */
export const filterImagesBySize = (images: ImageInfo[], minWidth = 100, minHeight = 100): ImageInfo[] => {
  return images.filter(img => 
    img.width && img.height && 
    img.width >= minWidth && 
    img.height >= minHeight
  );
};

/**
 * Remove duplicate image URLs
 */
export const removeDuplicateImages = (images: ImageInfo[]): ImageInfo[] => {
  const seen = new Set<string>();
  return images.filter(img => {
    if (seen.has(img.src)) {
      return false;
    }
    seen.add(img.src);
    return true;
  });
};