import {
  PortableText,
  type PortableTextComponents,
  type PortableTextProps,
} from "@portabletext/react";
import type { GalleryImage, RichText as RichTextValue } from "@/domain/content";
import { CmsImage } from "@/components/media/cms-image";
import { YouTubeEmbed } from "@/components/media/youtube-embed";
import { parseYouTubeId } from "@/lib/utils/youtube";

const components: PortableTextComponents = {
  types: {
    galleryImage: ({ value }: { value: GalleryImage }) =>
      value?.url ? (
        <figure className="my-6 space-y-2">
          <CmsImage image={value} sizes="(min-width: 768px) 768px, 100vw" className="rounded-lg" />
          {value.caption && <figcaption className="text-sm text-muted">{value.caption}</figcaption>}
        </figure>
      ) : null,
    youtubeVideo: ({ value }: { value: { url?: string; title?: string } }) =>
      value?.url ? (
        <div className="my-6">
          <YouTubeEmbed
            video={{ url: value.url, title: value.title, youtubeId: parseYouTubeId(value.url) }}
          />
        </div>
      ) : null,
  },
  marks: {
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const external = href.startsWith("http");
      return (
        <a
          href={href}
          className="underline underline-offset-2"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
};

export function RichText({ value }: { value?: RichTextValue }) {
  if (!value || value.length === 0) return null;
  return (
    <div className="prose-content space-y-4 leading-7">
      <PortableText value={value as PortableTextProps["value"]} components={components} />
    </div>
  );
}
