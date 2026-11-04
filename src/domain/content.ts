/**
 * CMS-agnostic domain types.
 *
 * UI components depend only on these types, never on Sanity documents.
 * Any content source (Sanity, Markdown, a database, fixtures) must map its
 * data into these shapes inside a `ContentRepository` implementation.
 */

export interface ImageAsset {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  /** Tiny base64 placeholder for blur-up loading, when available. */
  lqip?: string;
}

export interface GalleryImage extends ImageAsset {
  caption?: string;
}

export interface VideoEmbed {
  /** Original URL entered by the editor. */
  url: string;
  /** Parsed YouTube video id; undefined if the URL could not be parsed. */
  youtubeId?: string;
  title?: string;
}

export interface ExternalLink {
  label: string;
  url: string;
}

/** Portable rich text is kept opaque so the UI layer chooses a renderer. */
export type RichText = unknown[];

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body?: RichText;
  coverImage?: ImageAsset;
  gallery: GalleryImage[];
  videos: VideoEmbed[];
  techStack: string[];
  links: ExternalLink[];
  startDate?: string;
  endDate?: string;
  featured: boolean;
}

export type ResearchStatus = "ongoing" | "completed" | "published" | "under-review";

export interface Research {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body?: RichText;
  /** e.g. "AI/ML", "HPC" */
  areas: string[];
  status: ResearchStatus;
  advisor?: string;
  institution?: string;
  publication?: {
    venue?: string;
    authors?: string;
    year?: number;
    doi?: string;
    url?: string;
  };
  coverImage?: ImageAsset;
  gallery: GalleryImage[];
  videos: VideoEmbed[];
  links: ExternalLink[];
  startDate?: string;
  endDate?: string;
  featured: boolean;
}

export type EmploymentType = "full-time" | "part-time" | "internship" | "research" | "contract";

export interface Experience {
  id: string;
  role: string;
  organization: string;
  organizationUrl?: string;
  location?: string;
  employmentType?: EmploymentType;
  startDate: string;
  /** Undefined means current position. */
  endDate?: string;
  summary?: string;
  highlights: string[];
  techStack: string[];
  logo?: ImageAsset;
}

export type ConferenceRole = "attendee" | "presenter" | "poster" | "volunteer" | "speaker";

export interface Conference {
  id: string;
  slug: string;
  name: string;
  role: ConferenceRole;
  location?: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  body?: RichText;
  website?: string;
  coverImage?: ImageAsset;
  gallery: GalleryImage[];
  videos: VideoEmbed[];
}

export type SkillCategory =
  "language" | "framework" | "ml" | "hpc" | "cloud" | "database" | "tool" | "other";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  /** 1 (familiar) – 5 (expert) */
  proficiency?: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  highlights: string[];
  logo?: ImageAsset;
}

export interface Hobby {
  id: string;
  name: string;
  description?: string;
  image?: ImageAsset;
  gallery: GalleryImage[];
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  scholar?: string;
  twitter?: string;
  email?: string;
}

export interface SiteSettings {
  name: string;
  headline: string;
  bio?: string;
  location?: string;
  avatar?: ImageAsset;
  resumeUrl?: string;
  social: SocialLinks;
  seo: {
    title: string;
    description: string;
  };
}
