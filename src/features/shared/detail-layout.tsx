import Link from "next/link";
import type { ReactNode } from "react";
import type {
  ExternalLink,
  GalleryImage,
  ImageAsset,
  RichText as RichTextValue,
  VideoEmbed,
} from "@/domain/content";
import { CmsImage } from "@/components/media/cms-image";
import { PhotoGallery } from "@/components/media/photo-gallery";
import { VideoList } from "@/components/media/youtube-embed";
import { Container } from "@/components/ui/container";
import { RichText } from "@/components/ui/rich-text";
import { TagList } from "@/components/ui/tag-list";

interface DetailLayoutProps {
  backHref: string;
  backLabel: string;
  title: string;
  meta?: ReactNode;
  summary?: string;
  tags?: string[];
  coverImage?: ImageAsset;
  body?: RichTextValue;
  links?: ExternalLink[];
  gallery: GalleryImage[];
  videos: VideoEmbed[];
  children?: ReactNode;
}

/** Shared detail page for projects, research and conferences. */
export function DetailLayout(props: DetailLayoutProps) {
  const { links = [], tags = [] } = props;
  return (
    <Container>
      <article className="space-y-10">
        <header className="space-y-4">
          <Link href={props.backHref} className="text-sm text-muted hover:text-foreground">
            ← {props.backLabel}
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{props.title}</h1>
          {props.meta && <div className="text-sm text-muted">{props.meta}</div>}
          {props.summary && <p className="max-w-3xl text-lg text-muted">{props.summary}</p>}
          <TagList tags={tags} />
          {links.length > 0 && (
            <ul className="flex flex-wrap gap-4 text-sm">
              {links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </header>
        {props.coverImage && (
          <CmsImage
            image={props.coverImage}
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="w-full rounded-xl"
            priority
          />
        )}
        {props.children}
        <RichText value={props.body} />
        <PhotoGallery images={props.gallery} />
        <VideoList videos={props.videos} />
      </article>
    </Container>
  );
}
