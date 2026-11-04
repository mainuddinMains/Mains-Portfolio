import { describe, expect, it } from "vitest";
import { isValidYouTubeUrl, parseYouTubeId, youTubeEmbedUrl } from "./youtube";

const ID = "dQw4w9WgXcQ";

describe("parseYouTubeId", () => {
  it.each([
    `https://www.youtube.com/watch?v=${ID}`,
    `https://youtube.com/watch?v=${ID}&t=42s`,
    `https://m.youtube.com/watch?v=${ID}`,
    `https://youtu.be/${ID}`,
    `https://youtu.be/${ID}?si=abc`,
    `https://www.youtube.com/embed/${ID}`,
    `https://www.youtube-nocookie.com/embed/${ID}`,
    `https://www.youtube.com/shorts/${ID}`,
    `https://www.youtube.com/live/${ID}`,
    ID,
  ])("parses %s", (url) => {
    expect(parseYouTubeId(url)).toBe(ID);
  });

  it.each([
    "",
    "not a url",
    "https://vimeo.com/123456",
    "https://www.youtube.com/watch?v=short",
    "https://www.youtube.com/channel/UC123",
    "https://evil.com/watch?v=dQw4w9WgXcQ",
  ])("rejects %s", (url) => {
    expect(parseYouTubeId(url)).toBeUndefined();
  });

  it("handles null/undefined", () => {
    expect(parseYouTubeId(undefined)).toBeUndefined();
    expect(parseYouTubeId(null)).toBeUndefined();
  });
});

describe("helpers", () => {
  it("builds privacy-enhanced embed URLs", () => {
    expect(youTubeEmbedUrl(ID)).toBe(`https://www.youtube-nocookie.com/embed/${ID}`);
  });
  it("validates URLs", () => {
    expect(isValidYouTubeUrl(`https://youtu.be/${ID}`)).toBe(true);
    expect(isValidYouTubeUrl("https://example.com")).toBe(false);
  });
});
