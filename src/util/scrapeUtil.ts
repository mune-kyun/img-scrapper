import { ImageInfo } from "@/type";

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

export const isValidImageUrl = (url: string): boolean => {
  return /\.(jpeg|jpg|gif|png|svg|webp|bmp|tiff?|ico|avif)(\?.*)?$/i.test(url);
};