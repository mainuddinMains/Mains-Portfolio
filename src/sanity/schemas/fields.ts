import { defineArrayMember, defineField, type UrlRule } from "sanity";

/** Reusable field definitions shared by multiple document types. */

/** URL validation that only accepts http:// and https:// links. */
export const httpUrlValidation = (rule: UrlRule) => rule.uri({ scheme: ["http", "https"] });

export const slugField = (source = "title") =>
  defineField({
    name: "slug",
    title: "Slug",
    type: "slug",
    options: { source, maxLength: 96 },
    validation: (rule) => rule.required(),
  });

export const coverImageField = defineField({
  name: "coverImage",
  title: "Cover image",
  type: "accessibleImage",
  group: "media",
});

export const galleryField = defineField({
  name: "gallery",
  title: "Photo gallery",
  type: "array",
  group: "media",
  of: [defineArrayMember({ type: "galleryImage" })],
  options: { layout: "grid" },
});

export const videosField = defineField({
  name: "videos",
  title: "YouTube videos",
  type: "array",
  group: "media",
  of: [defineArrayMember({ type: "youtubeVideo" })],
});

export const linksField = defineField({
  name: "links",
  title: "Links",
  type: "array",
  of: [defineArrayMember({ type: "link" })],
});

export const tagListField = (name: string, title: string, group?: string) =>
  defineField({
    name,
    title,
    type: "array",
    group,
    of: [defineArrayMember({ type: "string" })],
    options: { layout: "tags" },
  });

export const startDateField = (required = false) =>
  defineField({
    name: "startDate",
    title: "Start date",
    type: "date",
    validation: required ? (rule) => rule.required() : undefined,
  });

export const endDateField = (description = "Leave empty if ongoing.") =>
  defineField({
    name: "endDate",
    title: "End date",
    type: "date",
    description,
    validation: (rule) =>
      rule.custom((end, context) => {
        const start = (context.document as { startDate?: string } | undefined)?.startDate;
        if (end && start && end < start) return "End date must be after the start date";
        return true;
      }),
  });

export const featuredField = defineField({
  name: "featured",
  title: "Featured on homepage",
  type: "boolean",
  initialValue: false,
});

export const orderField = defineField({
  name: "order",
  title: "Sort order",
  type: "number",
  description: "Lower numbers appear first. Optional.",
});

export const contentGroups = [
  { name: "content", title: "Content", default: true },
  { name: "media", title: "Media" },
];
