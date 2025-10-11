import { DEFAULT_NAVIGATE_TIMEOUT, DEFAULT_SCROLL_DELAY, DEFAULT_SCROLL_DISTANCE, DEFAULT_SCROLL_STAGNANT_RETRIES, DEFAULT_SCROLL_TIMEOUT } from "@/constant";
import { Page } from "puppeteer";
import { ScrollProps } from "@/type";

export const navigateToPage = async (page: Page, url: string, timeout = DEFAULT_NAVIGATE_TIMEOUT): Promise<void> => {
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout });
  } catch (error) {
    console.error('Error navigating to page:', error);
    throw error;
  }
};

export const scrollToLazyLoad = async (
  page: Page,
  scrollProps: ScrollProps = {}
): Promise<void> => {
  const {
    scrollDelay = DEFAULT_SCROLL_DELAY,
    scrollTimeout = DEFAULT_SCROLL_TIMEOUT,
    scrollDistance = DEFAULT_SCROLL_DISTANCE,
    scrollMaxStagnantRetries = DEFAULT_SCROLL_STAGNANT_RETRIES
  } = scrollProps;

  await page.evaluate(
    async (
      scrollDelay: number,
      scrollTimeout: number,
      scrollDistance: number,
      scrollMaxStagnantRetries: number
    ) => {
      await new Promise<void>(async (resolve) => {
        let totalHeight = 0;
        let previousScrollHeight = 0;
        let stagnantCount = 0;
        const startTime = Date.now();

        while (true) {
          const currentScrollHeight = document.body.scrollHeight;
          const elapsedTime = Date.now() - startTime;

          // Check if x seconds have passed
          if (elapsedTime >= scrollTimeout) {
            console.log(`Scrolling stopped after ${scrollTimeout / 1000} seconds timeout`);
            resolve();
            return;
          }

          // Incremental retry logic: check if we've been stuck at the same height
          if (totalHeight >= currentScrollHeight && currentScrollHeight === previousScrollHeight) {
            stagnantCount++;
            console.log(`Stagnant scroll detected (${stagnantCount}/${scrollMaxStagnantRetries})`);

            if (stagnantCount >= scrollMaxStagnantRetries) {
              console.log('Reached bottom after incremental retries');
              resolve();
              return;
            }
            
            // Wait a bit longer before next retry to allow lazy content to load
            await new Promise(resolve => setTimeout(resolve, scrollDelay * 2));
          } else {
            // Reset stagnant counter if we detected new content
            stagnantCount = 0;
          }

          // Update previous height for next comparison
          previousScrollHeight = currentScrollHeight;

          // Scroll down
          window.scrollBy(0, scrollDistance);
          totalHeight += scrollDistance;

          // Delay between scrolls
          await new Promise(resolve => setTimeout(resolve, scrollDelay));
        }
      });
    },
    scrollDelay,
    scrollTimeout,
    scrollDistance,
    scrollMaxStagnantRetries
  );
};