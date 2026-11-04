import type {
  Conference,
  ExternalLink,
  GalleryImage,
  Hobby,
  ImageAsset,
  Project,
  Research,
  SiteSettings,
  VideoEmbed,
} from "@/domain/content";
import { fallbackSiteSettings } from "@/lib/content/fallback-repository";
import { parseYouTubeId } from "@/lib/utils/youtube";

/**
 * Normalises raw GROQ results into domain types: removes nulls, fills
 * array defaults and parses YouTube ids. Pure functions, unit-tested.
 */

type Nullable<T> = { [K in keyof T]?: T[K] | null };

type RawImage = Nullable<ImageAsset> | null | undefined;
type RawGalleryImage = Nullable<GalleryImage>;
type RawVideo = { url?: string | null; title?: string | null };
type RawLink = { label?: string | null; url?: string | null };

const opt = <T>(value: T | null | undefined): T | undefined => value ?? undefined;

export function mapImage(raw: RawImage): ImageAsset | undefined {
  if (!raw?.url) return undefined;
  return {
    url: raw.url,
    alt: raw.alt ?? "",
    width: opt(raw.width),
    height: opt(raw.height),
    lqip: opt(raw.lqip),
  };
}

export function mapGallery(raw: RawGalleryImage[] | null | undefined): GalleryImage[] {
  return (raw ?? []).flatMap((item) => {
    const image = mapImage(item);
    return image ? [{ ...image, caption: opt(item.caption) }] : [];
  });
}

export function mapVideos(raw: RawVideo[] | null | undefined): VideoEmbed[] {
  return (raw ?? []).flatMap((v) =>
    v.url ? [{ url: v.url, youtubeId: parseYouTubeId(v.url), title: opt(v.title) }] : [],
  );
}

export function mapLinks(raw: RawLink[] | null | undefined): ExternalLink[] {
  return (raw ?? []).flatMap((l) => (l.label && l.url ? [{ label: l.label, url: l.url }] : []));
}

const strings = (raw: (string | null)[] | null | undefined): string[] =>
  (raw ?? []).filter((s): s is string => Boolean(s));

/* eslint-disable @typescript-eslint/no-explicit-any -- raw CMS payloads are untyped */

function mapMedia(raw: any) {
  return {
    coverImage: mapImage(raw.coverImage),
    gallery: mapGallery(raw.gallery),
    videos: mapVideos(raw.videos),
  };
}

export function mapProject(raw: any): Project {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title ?? "Untitled project",
    summary: raw.summary ?? "",
    body: opt(raw.body),
    techStack: strings(raw.techStack),
    links: mapLinks(raw.links),
    startDate: opt(raw.startDate),
    endDate: opt(raw.endDate),
    featured: Boolean(raw.featured),
    ...mapMedia(raw),
  };
}

export function mapResearch(raw: any): Research {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title ?? "Untitled research",
    summary: raw.summary ?? "",
    body: opt(raw.body),
    areas: strings(raw.areas),
    status: raw.status ?? "ongoing",
    advisor: opt(raw.advisor),
    institution: opt(raw.institution),
    publication: raw.publication
      ? {
          venue: opt(raw.publication.venue),
          authors: opt(raw.publication.authors),
          year: opt(raw.publication.year),
          doi: opt(raw.publication.doi),
          url: opt(raw.publication.url),
        }
      : undefined,
    links: mapLinks(raw.links),
    startDate: opt(raw.startDate),
    endDate: opt(raw.endDate),
    featured: Boolean(raw.featured),
    ...mapMedia(raw),
  };
}

export function mapConference(raw: any): Conference {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name ?? "Untitled conference",
    role: raw.role ?? "attendee",
    location: opt(raw.location),
    startDate: raw.startDate ?? "",
    endDate: opt(raw.endDate),
    summary: opt(raw.summary),
    body: opt(raw.body),
    website: opt(raw.website),
    ...mapMedia(raw),
  };
}

export function mapHobby(raw: any): Hobby {
  return {
    id: raw.id,
    name: raw.name ?? "",
    description: opt(raw.description),
    image: mapImage(raw.image),
    gallery: mapGallery(raw.gallery),
  };
}

export function mapSiteSettings(raw: any): SiteSettings {
  if (!raw) return fallbackSiteSettings;
  const social = raw.social ?? {};
  return {
    name: raw.name ?? fallbackSiteSettings.name,
    headline: raw.headline ?? fallbackSiteSettings.headline,
    bio: opt(raw.bio),
    location: opt(raw.location),
    avatar: mapImage(raw.avatar),
    resumeUrl: opt(raw.resumeUrl),
    social: {
      github: opt(social.github),
      linkedin: opt(social.linkedin),
      scholar: opt(social.scholar),
      twitter: opt(social.twitter),
      email: opt(social.email),
    },
    seo: {
      title: raw.seoTitle ?? raw.name ?? fallbackSiteSettings.seo.title,
      description: raw.seoDescription ?? raw.bio ?? fallbackSiteSettings.seo.description,
    },
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Strips nulls from simple flat documents (experience, education, skills). */
export function stripNulls<T>(raw: Record<string, unknown>, arrayKeys: string[] = []): T {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (value !== null && value !== undefined) out[key] = value;
  }
  for (const key of arrayKeys) out[key] = Array.isArray(out[key]) ? out[key] : [];
  if (raw.logo !== undefined) out.logo = mapImage(raw.logo as RawImage);
  if (out.logo === undefined) delete out.logo;
  return out as T;
}
