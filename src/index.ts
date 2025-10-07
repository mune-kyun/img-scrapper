import puppeteer, { Browser, Page } from 'puppeteer';

export interface ScrapperConfig {
  headless?: boolean;
  timeout?: number;
}

export const createBrowser = async (config: ScrapperConfig = {}): Promise<Browser> => {
  const defaultConfig = {
    headless: true,
    timeout: 30000,
    ...config
  };

  try {
    const browser = await puppeteer.launch({
      headless: defaultConfig.headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log('Browser initialized successfully');
    return browser;
  } catch (error) {
    console.error('Failed to initialize browser:', error);
    throw error;
  }
};

export const scrapeImages = async (
  browser: Browser, 
  url: string, 
  timeout = 30000
): Promise<string[]> => {
  const page: Page = await browser.newPage();
  
  try {
    console.log(`Navigating to: ${url}`);
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout 
    });

    // Extract image URLs
    const imageUrls = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images
        .map(img => img.src)
        .filter(src => src && src.startsWith('http'));
    });

    console.log(`Found ${imageUrls.length} images`);
    return imageUrls;

  } catch (error) {
    console.error('Error scraping images:', error);
    throw error;
  } finally {
    await page.close();
  }
};

export const closeBrowser = async (browser: Browser): Promise<void> => {
  await browser.close();
  console.log('Browser closed');
};

// Example usage
const main = async () => {
  const browser = await createBrowser({
    headless: false, // Set to true for production
    timeout: 30000
  });

  try {
    // Example: scrape images from a website
    const images = await scrapeImages(browser, 'https://example.com');
    
    console.log('Scraped images:');
    images.forEach((url, index) => {
      console.log(`${index + 1}: ${url}`);
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