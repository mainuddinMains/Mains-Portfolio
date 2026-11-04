import { defineField, defineType } from "sanity";
import { isValidYouTubeUrl } from "@/lib/utils/youtube";

export const youtubeVideo = defineType({
  name: "youtubeVideo",
  title: "YouTube video",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "YouTube URL",
      type: "url",
      description: "e.g. https://www.youtube.com/watch?v=… or https://youtu.be/…",
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            !value || isValidYouTubeUrl(value) ? true : "Must be a valid YouTube video URL",
          ),
    }),
    defineField({ name: "title", title: "Title", type: "string" }),
  ],
  preview: { select: { title: "title", subtitle: "url" } },
});
