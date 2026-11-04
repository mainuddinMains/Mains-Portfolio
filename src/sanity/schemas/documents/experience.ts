import { defineField, defineType } from "sanity";
import { endDateField, httpUrlValidation, startDateField, tagListField } from "../fields";

export const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({ name: "role", title: "Role", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "organization",
      title: "Organization",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "organizationUrl",
      title: "Organization website",
      type: "url",
      validation: httpUrlValidation,
    }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({
      name: "employmentType",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Full-time", value: "full-time" },
          { title: "Part-time", value: "part-time" },
          { title: "Internship", value: "internship" },
          { title: "Research", value: "research" },
          { title: "Contract", value: "contract" },
        ],
      },
    }),
    startDateField(true),
    endDateField("Leave empty for your current position."),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3 }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "string" }],
    }),
    tagListField("techStack", "Tech stack"),
    defineField({ name: "logo", title: "Logo", type: "accessibleImage" }),
  ],
  orderings: [
    { title: "Most recent", name: "startDesc", by: [{ field: "startDate", direction: "desc" }] },
  ],
  preview: { select: { title: "role", subtitle: "organization", media: "logo" } },
});
