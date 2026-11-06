// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { Conference, GalleryImage, Project } from "@/domain/content";
import { ConferenceGrid } from "@/features/conferences/conference-grid";
import { ProjectGrid } from "@/features/projects/project-grid";
import { DetailLayout } from "./detail-layout";

afterEach(cleanup);

const ID = "dQw4w9WgXcQ";
const photo = (name: string, caption?: string): GalleryImage => ({
  url: `https://cdn.sanity.io/images/p/production/${name}.jpg`,
  alt: `${name} alt`,
  width: 1200,
  height: 800,
  caption,
});

describe("DetailLayout", () => {
  it("renders description, cover, captioned gallery and multiple videos", () => {
    render(
      <DetailLayout
        backHref="/conferences"
        backLabel="All conferences"
        title="SC25"
        summary="Presented a poster on GPU scheduling."
        coverImage={photo("cover")}
        gallery={[photo("one", "Poster session"), photo("two")]}
        videos={[
          { url: `https://youtu.be/${ID}`, youtubeId: ID, title: "Talk" },
          { url: `https://youtu.be/${ID}`, youtubeId: ID },
          { url: "https://example.com/not-youtube", youtubeId: undefined },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { level: 1, name: "SC25" })).toBeTruthy();
    expect(screen.getByText("Presented a poster on GPU scheduling.")).toBeTruthy();
    expect(screen.getByAltText("cover alt")).toBeTruthy();
    expect(screen.getByAltText("one alt")).toBeTruthy();
    expect(screen.getByText("Poster session")).toBeTruthy();

    // The same video added twice renders twice; unparseable URLs are skipped.
    const iframes = document.querySelectorAll("iframe");
    expect(iframes).toHaveLength(2);
    for (const iframe of iframes) {
      expect(iframe.getAttribute("src")).toBe(`https://www.youtube-nocookie.com/embed/${ID}`);
      expect(iframe.getAttribute("loading")).toBe("lazy");
      expect(iframe.getAttribute("referrerpolicy")).toBe("strict-origin-when-cross-origin");
      expect(iframe.hasAttribute("allowfullscreen")).toBe(true);
    }
    expect(screen.getByTitle("Talk")).toBeTruthy();
    expect(screen.getByTitle("YouTube video")).toBeTruthy();
  });

  it("omits the gallery and video sections when there is no media", () => {
    render(<DetailLayout backHref="/" backLabel="Back" title="Bare" gallery={[]} videos={[]} />);
    expect(screen.queryByRole("region", { name: "Photos" })).toBeNull();
    expect(screen.queryByRole("region", { name: "Videos" })).toBeNull();
    expect(document.querySelector("iframe")).toBeNull();
  });
});

describe("list empty states", () => {
  it("explains that nothing is published yet", () => {
    render(
      <>
        <ProjectGrid projects={[]} />
        <ConferenceGrid items={[]} />
      </>,
    );
    expect(screen.getByText("No projects published yet.")).toBeTruthy();
    expect(screen.getByText("No conferences published yet.")).toBeTruthy();
  });

  it("links published items to their detail pages", () => {
    const project: Project = {
      id: "p1",
      slug: "hpc-scheduler",
      title: "HPC Scheduler",
      summary: "GPU jobs",
      gallery: [],
      videos: [],
      techStack: [],
      links: [],
      featured: false,
    };
    const conference: Conference = {
      id: "c1",
      slug: "sc25",
      name: "SC25",
      role: "presenter",
      startDate: "2025-11-16",
      gallery: [photo("poster")],
      videos: [],
    };
    render(
      <>
        <ProjectGrid projects={[project]} />
        <ConferenceGrid items={[conference]} />
      </>,
    );
    expect(screen.getByRole("link", { name: /HPC Scheduler/ }).getAttribute("href")).toBe(
      "/projects/hpc-scheduler",
    );
    const conferenceLink = screen.getByRole("link", { name: /SC25/ });
    expect(conferenceLink.getAttribute("href")).toBe("/conferences/sc25");
    // Without a cover image, the first gallery photo is used on the card.
    expect(screen.getByAltText("poster alt")).toBeTruthy();
  });
});
