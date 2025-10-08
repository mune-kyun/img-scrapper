import { Browser, Page } from 'puppeteer';
import { closeBrowser, createBrowser } from './utils/setup';
import { getImageDetails, removeDuplicateImages, scrollToLazyLoad } from './utils/scraping';
import { ImageInfo } from './types';

export const scrapeImages = async (
  browser: Browser, 
  url: string, 
  timeout = 30000
): Promise<ImageInfo[]> => {
  const page: Page = await browser.newPage();
  
  try {
    console.log(`Navigating to: ${url}`);
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout 
    });

    // Scroll to load lazy-loaded images
    await scrollToLazyLoad(page, 100);

    // Extract image details
    const imageDetails = removeDuplicateImages(await getImageDetails(page));

    console.log(`Found ${imageDetails.length} images`);
    return imageDetails;
  } catch (error) {
    console.error('Error scraping images:', error);
    throw error;
  } finally {
    await page.close();
  }
};

// Example usage
const main = async () => {
  const browser = await createBrowser({
    headless: false, // Set to true for production
    timeout: 30000
  });

  try {
    const url = process.argv[2];
    if (!url) {
      throw new Error('Please provide a URL as the first argument');
    }
    const images: ImageInfo[] = await scrapeImages(browser, url);

    console.log('Scraped images:');
    images.forEach((image, index) => {
      console.log(`${index + 1}: ${image.src}`);
    });

  } catch (error) {
    console.error('Scraping failed:', error);
  } finally {
    await closeBrowser(browser);
  }
};

// Run the example if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}