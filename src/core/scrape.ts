import { Page } from 'puppeteer';
import { ImageInfo } from '@/type';

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
      src: img?.src || '',
      alt: img?.alt || undefined,
      width: img?.naturalWidth && img.naturalWidth > 0 ? img.naturalWidth : undefined,
      height: img?.naturalHeight && img.naturalHeight > 0 ? img.naturalHeight : undefined
    })).filter(info => info.src && info.src.startsWith('http'));
  });
};

/**
 * Scroll to lazy load
 */
export const scrollToLazyLoad = async (page: Page, scrollDelay = 1000): Promise<void> => {
  await page.evaluate(async (delay) => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      let previousScrollHeight = 0;
      const distance = 100;
      
      const timer = setInterval(async () => {
        const currentScrollHeight = document.body.scrollHeight;
        
        // If we've scrolled past the content and height hasn't changed, we're done
        if (totalHeight >= currentScrollHeight && currentScrollHeight === previousScrollHeight) {
          clearInterval(timer);
          resolve();
          return;
        }
        
        // Update previous height for next comparison
        previousScrollHeight = currentScrollHeight;
        
        // Scroll down
        window.scrollBy(0, distance);
        totalHeight += distance;

        // Delay between scrolls
        await new Promise(resolve => setTimeout(resolve, 100));
        
      }, delay);
    });
  }, scrollDelay);
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