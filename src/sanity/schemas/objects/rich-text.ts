import { defineArrayMember, defineType } from "sanity";

/** Portable Text body with headings, lists, links, inline images and videos. */
export const richText = defineType({
  name: "richText",
  title: "Body",
  type: "array",
  of: [
    defineArrayMember({ type: "block" }),
    defineArrayMember({ type: "galleryImage" }),
    defineArrayMember({ type: "youtubeVideo" }),
  ],
});
