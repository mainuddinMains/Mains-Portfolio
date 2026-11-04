import { defineField, defineType } from "sanity";

/** Singleton document (fixed id "siteSettings"), see structure.ts. */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "profile", title: "Profile", default: true },
    { name: "social", title: "Social" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Full name",
      type: "string",
      group: "profile",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      group: "profile",
      description: "Short tagline shown on the homepage.",
    }),
    defineField({ name: "bio", title: "Short bio", type: "text", rows: 4, group: "profile" }),
    defineField({ name: "location", title: "Location", type: "string", group: "profile" }),
    defineField({ name: "avatar", title: "Avatar", type: "accessibleImage", group: "profile" }),
    defineField({ name: "resume", title: "Résumé (PDF)", type: "file", group: "profile" }),
    defineField({
      name: "social",
      title: "Social links",
      type: "object",
      group: "social",
      fields: [
        defineField({ name: "github", title: "GitHub", type: "url" }),
        defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
        defineField({ name: "scholar", title: "Google Scholar", type: "url" }),
        defineField({ name: "twitter", title: "X / Twitter", type: "url" }),
        defineField({ name: "email", title: "Email", type: "email" }),
      ],
    }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string", group: "seo" }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 2,
      group: "seo",
      validation: (r) => r.max(160),
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
