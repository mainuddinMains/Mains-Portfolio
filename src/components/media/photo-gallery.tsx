import type { GalleryImage } from "@/domain/content";
import { CmsImage } from "./cms-image";

export function PhotoGallery({
  images,
  title = "Photos",
}: {
  images: GalleryImage[];
  title?: string;
}) {
  if (images.length === 0) return null;
  return (
    <section aria-label={title} className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <li key={`${image.url}-${index}`}>
            <figure className="space-y-2">
              <CmsImage
                image={image}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="aspect-[4/3] w-full rounded-lg object-cover"
              />
              {image.caption && (
                <figcaption className="text-sm text-muted">{image.caption}</figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
