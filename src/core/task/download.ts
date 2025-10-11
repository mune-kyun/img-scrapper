import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { ImageInfo } from '@/type';
import { URL } from 'url';
import { DEFAULT_DOWNLOAD_BATCH_SIZE } from '@/constant';

export const downloadImage = async (imageInfo: ImageInfo, saveDir: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const url = new URL(imageInfo.src);
    const fileName = path.basename(url.pathname);
    const filePath = path.join(saveDir, fileName);

    const file = fs.createWriteStream(filePath);
    const request = url.protocol === 'https:' ? https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(filePath));
      });
    }) : http.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(filePath));
      });
    });

    request.on('error', (err) => {
      fs.unlink(filePath, () => reject(err));
    });
  });
};

export const downloadImages = async (images: ImageInfo[], saveDir: string): Promise<string[]> => {
  fs.mkdirSync(saveDir, { recursive: true });
  
  const downloadedPaths: string[] = [];

  for (let i = 0; i < images.length; i += DEFAULT_DOWNLOAD_BATCH_SIZE) {
    const batch = images.slice(i, i + DEFAULT_DOWNLOAD_BATCH_SIZE);
    const results = await Promise.all(batch.map(image => downloadImage(image, saveDir)));
    downloadedPaths.push(...results);
  }

  return downloadedPaths;
};