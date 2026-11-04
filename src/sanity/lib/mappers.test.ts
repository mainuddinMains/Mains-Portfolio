import { describe, expect, it } from "vitest";
import { fallbackSiteSettings } from "@/lib/content/fallback-repository";
import {
  mapConference,
  mapGallery,
  mapImage,
  mapLinks,
  mapProject,
  mapSiteSettings,
  mapVideos,
  stripNulls,
} from "./mappers";

const img = {
  url: "https://cdn.sanity.io/images/p/d/a.jpg",
  alt: "A",
  width: 10,
  height: 5,
  lqip: null,
};

describe("media mappers", () => {
  it("maps images and drops ones without a URL", () => {
    expect(mapImage(img)).toEqual({
      url: img.url,
      alt: "A",
      width: 10,
      height: 5,
      lqip: undefined,
    });
    expect(mapImage({ url: null, alt: "x" })).toBeUndefined();
    expect(mapImage(null)).toBeUndefined();
  });

  it("maps galleries with captions", () => {
    const gallery = mapGallery([{ ...img, caption: "Keynote" }, { url: null }]);
    expect(gallery).toHaveLength(1);
    expect(gallery[0].caption).toBe("Keynote");
  });

  it("parses multiple YouTube videos and skips empty entries", () => {
    const videos = mapVideos([
      { url: "https://youtu.be/dQw4w9WgXcQ", title: "Talk" },
      { url: "https://example.com/not-youtube" },
      { url: null },
    ]);
    expect(videos).toEqual([
      { url: "https://youtu.be/dQw4w9WgXcQ", youtubeId: "dQw4w9WgXcQ", title: "Talk" },
      { url: "https://example.com/not-youtube", youtubeId: undefined, title: undefined },
    ]);
  });

  it("drops incomplete links", () => {
    expect(mapLinks([{ label: "GitHub", url: "https://github.com" }, { label: "x" }])).toEqual([
      { label: "GitHub", url: "https://github.com" },
    ]);
  });
});

describe("document mappers", () => {
  it("fills defaults for a sparse project", () => {
    const project = mapProject({
      id: "p1",
      slug: "demo",
      title: "Demo",
      gallery: null,
      videos: null,
    });
    expect(project).toMatchObject({
      id: "p1",
      slug: "demo",
      summary: "",
      techStack: [],
      links: [],
      gallery: [],
      videos: [],
      featured: false,
      coverImage: undefined,
    });
  });

  it("maps a conference with gallery and videos", () => {
    const c = mapConference({
      id: "c1",
      slug: "sc25",
      name: "SC25",
      startDate: "2025-11-16",
      gallery: [{ ...img, caption: "Poster session" }],
      videos: [{ url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }],
    });
    expect(c.role).toBe("attendee");
    expect(c.gallery[0].caption).toBe("Poster session");
    expect(c.videos[0].youtubeId).toBe("dQw4w9WgXcQ");
  });

  it("falls back to default site settings", () => {
    expect(mapSiteSettings(null)).toBe(fallbackSiteSettings);
    const s = mapSiteSettings({ name: "Jane", social: null });
    expect(s.name).toBe("Jane");
    expect(s.seo.title).toBe("Jane");
    expect(s.social).toEqual({
      github: undefined,
      linkedin: undefined,
      scholar: undefined,
      twitter: undefined,
      email: undefined,
    });
  });

  it("stripNulls removes nulls and defaults arrays", () => {
    const out = stripNulls<Record<string, unknown>>(
      { id: "e1", role: "Intern", endDate: null, highlights: null, logo: null },
      ["highlights", "techStack"],
    );
    expect(out).toEqual({ id: "e1", role: "Intern", highlights: [], techStack: [] });
  });
});
