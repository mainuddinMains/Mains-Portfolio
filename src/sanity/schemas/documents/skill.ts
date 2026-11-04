import { defineField, defineType } from "sanity";
import { orderField } from "../fields";

export const skill = defineType({
  name: "skill",
  title: "Skill",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Language", value: "language" },
          { title: "Framework / library", value: "framework" },
          { title: "AI / ML", value: "ml" },
          { title: "HPC", value: "hpc" },
          { title: "Cloud / DevOps", value: "cloud" },
          { title: "Database", value: "database" },
          { title: "Tool", value: "tool" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "proficiency",
      title: "Proficiency (1–5)",
      type: "number",
      validation: (r) => r.min(1).max(5).integer(),
    }),
    orderField,
  ],
  preview: { select: { title: "name", subtitle: "category" } },
});
