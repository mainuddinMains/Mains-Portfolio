import Link from "next/link";
import type { ImageAsset } from "@/domain/content";
import { CmsImage } from "@/components/media/cms-image";
import { TagList } from "./tag-list";

interface ContentCardProps {
  href: string;
  title: string;
  summary?: string;
  meta?: string;
  tags?: string[];
  image?: ImageAsset;
}

export function ContentCard({ href, title, summary, meta, tags = [], image }: ContentCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-background transition hover:border-foreground/30">
      <Link href={href} className="block h-full focus-visible:outline-none">
        {image && (
          <CmsImage
            image={image}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="aspect-video w-full object-cover"
          />
        )}
        <div className="space-y-2 p-5">
          {meta && <p className="text-xs tracking-wide text-muted uppercase">{meta}</p>}
          <h3 className="text-lg font-semibold group-hover:underline">{title}</h3>
          {summary && <p className="line-clamp-3 text-sm text-muted">{summary}</p>}
          <TagList tags={tags} />
        </div>
      </Link>
    </article>
  );
}
