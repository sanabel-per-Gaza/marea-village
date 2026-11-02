export interface GalleryPhoto {
  src: string;
  srcSmall?: string;
  alt: string;
  width: number;
  height: number;
  fonte?: string;
}

export function slideIndex(current: number, step: number, total: number) {
  return total > 0 ? ((current + step) % total + total) % total : 0;
}
