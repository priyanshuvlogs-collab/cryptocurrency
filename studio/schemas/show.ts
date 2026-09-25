import { defineField, defineType } from "sanity";

export const show = defineType({
  name: "show",
  title: "Show",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Show name", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "nativeName", title: "Name in Gurmukhi (shown under the English name)", type: "string", placeholder: "ਭੇਡਾਂ ਦਾ ਕਾਲ" }),
    defineField({ name: "slug", title: "Web address", type: "slug", options: { source: "name.en" }, validation: (r) => r.required() }),
    defineField({ name: "tagline", title: "One-line summary", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "localeText" }),
    defineField({ name: "host", title: "Host", type: "string", initialValue: "Indi Jaswal" }),
    defineField({ name: "image", title: "Show artwork", type: "image", options: { hotspot: true } }),
    defineField({ name: "callIn", title: "Live call-in show?", type: "boolean", initialValue: true }),
    defineField({ name: "featured", title: "Featured (flagship) show", type: "boolean", initialValue: false }),
    defineField({ name: "youtubePlaylistId", title: "YouTube playlist ID", type: "string", description: "Videos in this playlist appear on the show page. Starts with PL…" }),
    defineField({ name: "keywords", title: "Title keywords", type: "array", of: [{ type: "string" }], options: { layout: "tags" }, description: "YouTube videos whose title contains one of these words are tagged to this show." }),
    defineField({ name: "orderRank", title: "Sort order", type: "number" }),
  ],
  preview: { select: { title: "name.en", subtitle: "nativeName", media: "image" } },
});
