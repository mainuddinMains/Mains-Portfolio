"use client";

import Image, { type ImageLoader } from "next/image";
import type { ImageAsset } from "@/domain/content";

/**
 * Sanity's CDN resizes images itself, so we bypass the Next.js optimizer
 * (which counts against Vercel image-optimization quota) for Sanity URLs.
 */
const sanityLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
};

interface CmsImageProps {
  image: ImageAsset;
  sizes: string;
  className?: string;
  priority?: boolean;
}

export function CmsImage({ image, sizes, className, priority }: CmsImageProps) {
  const isSanity = image.url.startsWith("https://cdn.sanity.io/");
  return (
    <Image
      src={image.url}
      alt={image.alt}
      width={image.width ?? 1600}
      height={image.height ?? 900}
      sizes={sizes}
      className={className}
      preload={priority}
      loader={isSanity ? sanityLoader : undefined}
      placeholder={image.lqip ? "blur" : "empty"}
      blurDataURL={image.lqip}
    />
  );
}
