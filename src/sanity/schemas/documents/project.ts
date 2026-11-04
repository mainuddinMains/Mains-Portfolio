import { defineField, defineType } from "sanity";
import {
  contentGroups,
  coverImageField,
  endDateField,
  featuredField,
  galleryField,
  linksField,
  orderField,
  slugField,
  startDateField,
  tagListField,
  videosField,
} from "../fields";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: contentGroups,
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    slugField(),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (r) => r.required().max(300),
    }),
    defineField({ name: "body", title: "Details", type: "richText" }),
    tagListField("techStack", "Tech stack"),
    linksField,
    startDateField(),
    endDateField(),
    featuredField,
    orderField,
    coverImageField,
    galleryField,
    videosField,
  ],
  orderings: [
    { title: "Newest", name: "startDesc", by: [{ field: "startDate", direction: "desc" }] },
    { title: "Manual order", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "title", subtitle: "summary", media: "coverImage" } },
});
