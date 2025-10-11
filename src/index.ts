import { Browser, Page } from 'puppeteer';
import { closeBrowser, createBrowser, exposeUtils } from './util/setupUtil';
import { DownloadListState, NavigateState  } from './core/state';
import { DEFAULT_BROWSER_TIMEOUT } from './constant';
import { NavigateStateContext } from './type';

export const scrapeImages = async (
  browser: Browser, 
  url: string,
): Promise<void> => {
  const page: Page = await browser.newPage();
  await exposeUtils(page);
  
  try {
    const download: DownloadListState = new DownloadListState();

    const navigateStateContext: NavigateStateContext = {
      page,
      url,
      shouldScrollToLoad: true,
    };
    const navigate: NavigateState = new NavigateState(download);

    await navigate.task(navigateStateContext);
  } catch (error) {
    console.error('Error scraping images:', error);
    throw error;
  } finally {
    await page.close();
  }
};

const main = async () => {
  const browser = await createBrowser({
    headless: false,
    timeout: DEFAULT_BROWSER_TIMEOUT
  });

  try {
    const url = process.argv[2];
    if (!url) {
      throw new Error('Please provide a URL as the first argument');
    }

    await scrapeImages(browser, url);
    
    console.log('Successfully scrappinging images...');
  } catch (error) {
    console.error('Scraping failed:', error);
  } finally {
    await closeBrowser(browser);
  }
};

if (require.main === module) {
  main().catch(console.error);
}