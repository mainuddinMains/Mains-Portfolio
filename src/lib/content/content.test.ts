import { describe, expect, it } from "vitest";
import { fallbackRepository, fallbackSiteSettings } from "./fallback-repository";
import { PLACEHOLDER_SLUG, toSlugParams } from "./static-params";
import { CONTENT_TYPES, contentTag, isContentType } from "./tags";

describe("fallback repository", () => {
  it("returns empty collections and default settings", async () => {
    expect(await fallbackRepository.getSiteSettings()).toBe(fallbackSiteSettings);
    expect(await fallbackRepository.getProjects()).toEqual([]);
    expect(await fallbackRepository.getConferenceBySlug("x")).toBeNull();
  });
});

describe("toSlugParams", () => {
  it("returns a placeholder when there is no content", () => {
    expect(toSlugParams([])).toEqual([{ slug: PLACEHOLDER_SLUG }]);
  });
  it("maps slugs and skips empty ones", () => {
    expect(toSlugParams([{ slug: "a" }, { slug: "" }])).toEqual([{ slug: "a" }]);
  });
});

describe("cache tags", () => {
  it("tags every content type", () => {
    expect(CONTENT_TYPES.map(contentTag)).toContain("content:project");
    expect(isContentType("conference")).toBe(true);
    expect(isContentType("user")).toBe(false);
    expect(isContentType(undefined)).toBe(false);
  });
});
