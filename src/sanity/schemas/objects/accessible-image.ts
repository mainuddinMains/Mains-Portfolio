import { defineField, defineType } from "sanity";

/** Image with required alt text, used for covers, logos and avatars. */
export const accessibleImage = defineType({
  name: "accessibleImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description: "Describe the image for screen readers and SEO.",
      validation: (rule) => rule.required().error("Alt text is required for accessibility."),
    }),
  ],
});
