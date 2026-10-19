import type { ImageMetadata } from 'astro';

/* všetky fotky zo src/photos — cesty v JSON manifestoch (/src/photos/kuchyne/img1.jpg) sa prekladajú cez túto mapu */
const all = import.meta.glob<{ default: ImageMetadata }>(
  '/src/photos/**/*.{jpg,jpeg,png,webp,avif,gif,tif,tiff,JPG,JPEG,PNG,WEBP,AVIF,GIF,TIF,TIFF}',
  { eager: true }
);

export function photo(path: string | undefined): ImageMetadata | undefined {
  if (!path) return undefined;
  const img = all[path]?.default;
  if (!img) console.warn(`[fotky] súbor sa nenašiel alebo má nepodporovaný formát: ${path}`);
  return img;
}
