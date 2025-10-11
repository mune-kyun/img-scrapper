import { ScrapperConfig } from '@/type';
import puppeteer, { Browser, Page } from 'puppeteer';
import { isValidImageUrl } from './scrapeUtil';

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

export const closeBrowser = async (browser: Browser): Promise<void> => {
  await browser.close();
  console.log('Browser closed');
};

export const exposeUtils = async (page: Page) => {
  await page.exposeFunction('isValidImageUrl', isValidImageUrl);
};