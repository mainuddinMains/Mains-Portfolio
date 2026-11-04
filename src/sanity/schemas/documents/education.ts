import { defineField, defineType } from "sanity";
import { endDateField, startDateField } from "../fields";

export const education = defineType({
  name: "education",
  title: "Education",
  type: "document",
  fields: [
    defineField({
      name: "institution",
      title: "Institution",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "degree",
      title: "Degree",
      type: "string",
      description: "e.g. MS, BS",
      validation: (r) => r.required(),
    }),
    defineField({ name: "field", title: "Field of study", type: "string" }),
    defineField({ name: "location", title: "Location", type: "string" }),
    startDateField(true),
    endDateField("Leave empty if in progress, or set the expected graduation date."),
    defineField({ name: "gpa", title: "GPA", type: "string" }),
    defineField({
      name: "highlights",
      title: "Highlights (coursework, honors)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "logo", title: "Logo", type: "accessibleImage" }),
  ],
  preview: { select: { title: "degree", subtitle: "institution", media: "logo" } },
});
