import { defineField, defineType } from "sanity";
import { galleryField, orderField } from "../fields";

export const hobby = defineType({
  name: "hobby",
  title: "Hobby",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Media" },
  ],
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "image", title: "Image", type: "accessibleImage", group: "media" }),
    galleryField,
    orderField,
  ],
  preview: { select: { title: "name", media: "image" } },
});
