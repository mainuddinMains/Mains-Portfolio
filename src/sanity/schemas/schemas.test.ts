import { describe, expect, it } from "vitest";
import { CONTENT_TYPES } from "@/lib/content/tags";
import { schemaTypes, singletonTypes } from "./index";

describe("Sanity schemas", () => {
  const names = schemaTypes.map((t) => t.name);

  it("defines a document type for every content type", () => {
    for (const type of CONTENT_TYPES) expect(names).toContain(type);
  });

  it("has unique type names", () => {
    expect(new Set(names).size).toBe(names.length);
  });

  it("supports galleries and multiple videos on conferences", () => {
    const conference = schemaTypes.find((t) => t.name === "conference") as unknown as {
      fields: { name: string; type: string; of?: { type: string }[] }[];
    };
    const gallery = conference.fields.find((f) => f.name === "gallery");
    const videos = conference.fields.find((f) => f.name === "videos");
    expect(gallery?.of?.[0].type).toBe("galleryImage");
    expect(videos?.of?.[0].type).toBe("youtubeVideo");
  });

  type Field = { name: string; type: string; of?: { type: string }[] };
  const fieldsOf = (name: string) =>
    (schemaTypes.find((t) => t.name === name) as unknown as { fields: Field[] }).fields;

  it.each(["project", "conference"])(
    "%s supports a description, cover, captioned gallery and multiple videos",
    (name) => {
      const fields = fieldsOf(name);
      const field = (n: string) => fields.find((f) => f.name === n);
      expect(field("summary")?.type).toBe("text");
      expect(field("body")?.type).toBe("richText");
      expect(field("coverImage")?.type).toBe("accessibleImage");
      expect(field("gallery")?.of?.[0].type).toBe("galleryImage");
      expect(field("videos")).toMatchObject({ type: "array", of: [{ type: "youtubeVideo" }] });
    },
  );

  it("gallery images have alt text and a caption", () => {
    expect(fieldsOf("galleryImage").map((f) => f.name)).toEqual(["alt", "caption"]);
  });

  it("treats site settings as a singleton", () => {
    expect(singletonTypes.has("siteSettings")).toBe(true);
  });
});
