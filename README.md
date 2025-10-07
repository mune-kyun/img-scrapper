# Image Scrapper

A TypeScript-based image scraping tool using Puppeteer.

## Features

- 🎯 Scrape images from any website
- 🔧 TypeScript for type safety
- 🚀 Puppeteer for reliable web scraping
- 📦 Yarn for package management
- 🛠️ Utility functions for advanced scraping

## Prerequisites

- Node.js >= 18.0.0
- Yarn package manager

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```

## Usage

### Development

Run in development mode with hot reload:
```bash
yarn dev
```

### Build and Run

Build the project:
```bash
yarn build
```

Run the built project:
```bash
yarn start
```

### Watch Mode

Compile TypeScript in watch mode:
```bash
yarn watch
```

### Clean

Remove build artifacts:
```bash
yarn clean
```

## Project Structure

```
src/
├── index.ts          # Main entry point with ImageScrapper class
└── utils/
    └── scraping.ts    # Utility functions for scraping operations
```

## Example Usage

```typescript
import { createBrowser, scrapeImages, closeBrowser } from './src/index';

const browser = await createBrowser({
  headless: false,
  timeout: 30000
});

const images = await scrapeImages(browser, 'https://example.com');
console.log('Found images:', images);
await closeBrowser(browser);
```

## API

### Functions

Simple, clean functions for scraping images from websites.

#### `createBrowser(config?: ScrapperConfig): Promise<Browser>`

Creates and initializes a new browser instance.

**Config Options:**
- `headless` (boolean): Run browser in headless mode (default: true)
- `timeout` (number): Page load timeout in milliseconds (default: 30000)

#### `scrapeImages(browser: Browser, url: string, timeout?: number): Promise<string[]>`

Scrape image URLs from a webpage.

#### `closeBrowser(browser: Browser): Promise<void>`

Close the browser and cleanup resources.

### Utility Functions

Advanced scraping helpers:

- `waitForImages(page, timeout)`: Wait for all images to load
- `getImageDetails(page)`: Get detailed image information
- `scrollToLoadImages(page, scrollDelay)`: Scroll to load lazy-loaded images
- `filterImagesBySize(images, minWidth, minHeight)`: Filter images by minimum dimensions
- `removeDuplicateImages(images)`: Remove duplicate image URLs

## License

ISC