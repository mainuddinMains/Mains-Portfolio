import { defineField, defineType } from "sanity";
import {
  contentGroups,
  coverImageField,
  endDateField,
  galleryField,
  slugField,
  startDateField,
  videosField,
} from "../fields";

export const conference = defineType({
  name: "conference",
  title: "Conference",
  type: "document",
  groups: contentGroups,
  fields: [
    defineField({
      name: "name",
      title: "Conference name",
      type: "string",
      validation: (r) => r.required(),
    }),
    slugField("name"),
    defineField({
      name: "role",
      title: "Your role",
      type: "string",
      initialValue: "attendee",
      options: {
        list: [
          { title: "Attendee", value: "attendee" },
          { title: "Presenter", value: "presenter" },
          { title: "Poster", value: "poster" },
          { title: "Speaker", value: "speaker" },
          { title: "Volunteer", value: "volunteer" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "location", title: "Location", type: "string" }),
    startDateField(true),
    endDateField("Optional, for multi-day events."),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3 }),
    defineField({ name: "body", title: "Notes / takeaways", type: "richText" }),
    defineField({ name: "website", title: "Conference website", type: "url" }),
    coverImageField,
    galleryField,
    videosField,
  ],
  orderings: [
    { title: "Most recent", name: "startDesc", by: [{ field: "startDate", direction: "desc" }] },
  ],
  preview: { select: { title: "name", subtitle: "startDate", media: "coverImage" } },
});
