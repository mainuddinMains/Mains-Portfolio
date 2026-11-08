import { describe, expect, it, vi } from "vitest";
import * as q from "@/sanity/lib/queries";

const fetch = vi.fn();
vi.mock("@/sanity/lib/client", () => ({ getSanityClient: () => ({ fetch }) }));

const { sanityRepository } = await import("./sanity-repository");

const ID = "dQw4w9WgXcQ";
const image = (name: string, extra: Record<string, unknown> = {}) => ({
  url: `https://cdn.sanity.io/images/p/production/${name}.jpg`,
  alt: `${name} alt`,
  width: 1200,
  height: 800,
  lqip: null,
  ...extra,
});

/** Shape returned by the GROQ projections in queries.ts for a published document. */
const rawProject = {
  id: "project-1",
  slug: "hpc-scheduler",
  title: "HPC Scheduler",
  summary: "A job scheduler for GPU clusters.",
  body: [{ _type: "block", _key: "b1", children: [{ _type: "span", text: "Details" }] }],
  techStack: ["Go", null, "Slurm"],
  links: [{ label: "GitHub", url: "https://github.com/x/y" }],
  startDate: "2025-01-01",
  endDate: null,
  featured: true,
  coverImage: image("cover"),
  gallery: [image("one", { caption: "Cluster rack" }), image("two", { caption: null })],
  videos: [
    { url: `https://www.youtube.com/watch?v=${ID}`, title: "Demo" },
    { url: "https://youtu.be/aaaaaaaaaaa", title: null },
  ],
};

describe("sanityRepository", () => {
  it("fetches a published project by slug and maps it to the domain type", async () => {
    fetch.mockResolvedValue(rawProject);
    const project = await sanityRepository.getProjectBySlug("hpc-scheduler");

    expect(fetch).toHaveBeenLastCalledWith(q.projectBySlugQuery, { slug: "hpc-scheduler" });
    expect(project).toMatchObject({
      slug: "hpc-scheduler",
      title: "HPC Scheduler",
      summary: "A job scheduler for GPU clusters.",
      techStack: ["Go", "Slurm"],
      endDate: undefined,
      coverImage: { url: rawProject.coverImage.url, alt: "cover alt" },
    });
    expect(project?.gallery.map((g) => g.caption)).toEqual(["Cluster rack", undefined]);
    expect(project?.videos.map((v) => v.youtubeId)).toEqual([ID, "aaaaaaaaaaa"]);
    expect(project?.body).toHaveLength(1);
  });

  it("returns null when no published document matches the slug", async () => {
    fetch.mockResolvedValue(null);
    expect(await sanityRepository.getProjectBySlug("missing")).toBeNull();
    expect(await sanityRepository.getConferenceBySlug("missing")).toBeNull();
  });

  it("passes the featured filter to the project list query", async () => {
    fetch.mockResolvedValue([rawProject]);
    const projects = await sanityRepository.getProjects({ featuredOnly: true });
    expect(fetch).toHaveBeenLastCalledWith(q.projectsQuery, { featuredOnly: true });
    expect(projects).toHaveLength(1);
  });

  it("maps conferences with gallery captions and multiple videos", async () => {
    fetch.mockResolvedValue([
      {
        id: "conf-1",
        slug: "sc25",
        name: "SC25",
        role: "presenter",
        startDate: "2025-11-16",
        coverImage: null,
        gallery: [image("poster", { caption: "Poster session" })],
        videos: [{ url: `https://youtu.be/${ID}` }, { url: `https://youtube.com/shorts/${ID}` }],
      },
    ]);
    const [conference] = await sanityRepository.getConferences();
    expect(fetch).toHaveBeenLastCalledWith(q.conferencesQuery, {});
    expect(conference.coverImage).toBeUndefined();
    expect(conference.gallery[0].caption).toBe("Poster session");
    expect(conference.videos).toHaveLength(2);
  });

  it("treats an empty response as an empty list", async () => {
    fetch.mockResolvedValue(null);
    expect(await sanityRepository.getConferences()).toEqual([]);
  });

  it("propagates fetch errors so the error boundary can handle them", async () => {
    fetch.mockRejectedValue(new Error("network down"));
    await expect(sanityRepository.getProjects()).rejects.toThrow("network down");
  });
});

describe("GROQ queries", () => {
  it("only return documents with a slug and include media fields", () => {
    for (const query of [q.projectsQuery, q.conferencesQuery]) {
      expect(query).toContain("defined(slug.current)");
    }
    for (const query of [q.projectBySlugQuery, q.conferenceBySlugQuery]) {
      expect(query).toContain("slug.current == $slug");
      expect(query).toContain('"coverImage"');
      expect(query).toContain("caption");
      expect(query).toContain('"videos": videos[]{ url, title }');
    }
  });
});
