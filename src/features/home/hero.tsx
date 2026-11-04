import Link from "next/link";
import type { SiteSettings } from "@/domain/content";
import { CmsImage } from "@/components/media/cms-image";

export function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="flex flex-col-reverse gap-8 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-2xl space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{settings.name}</h1>
        <p className="text-lg text-muted">{settings.headline}</p>
        {settings.bio && <p className="leading-7">{settings.bio}</p>}
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/projects"
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            View projects
          </Link>
          <Link
            href="/research"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-surface"
          >
            Research
          </Link>
          {settings.resumeUrl && (
            <a
              href={settings.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-surface"
            >
              Résumé
            </a>
          )}
        </div>
      </div>
      {settings.avatar && (
        <CmsImage
          image={settings.avatar}
          sizes="160px"
          priority
          className="size-32 rounded-full object-cover sm:size-40"
        />
      )}
    </section>
  );
}
