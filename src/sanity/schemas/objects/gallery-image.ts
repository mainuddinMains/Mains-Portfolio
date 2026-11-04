import { defineField, defineType } from "sanity";

/** Image inside a photo gallery, with alt text and an optional caption. */
export const galleryImage = defineType({
  name: "galleryImage",
  title: "Gallery image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      validation: (rule) => rule.required().warning("Alt text improves accessibility."),
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
  ],
  preview: {
    select: { media: "asset", title: "caption", subtitle: "alt" },
  },
});
