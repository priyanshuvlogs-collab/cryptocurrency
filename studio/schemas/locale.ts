import { defineField, defineType } from "sanity";

/** Every visible text field is stored in both site languages. */
export const localeString = defineType({
  name: "localeString",
  title: "Text (English + Punjabi)",
  type: "object",
  fields: [
    defineField({ name: "en", title: "English", type: "string", validation: (r) => r.required() }),
    defineField({ name: "pa", title: "ਪੰਜਾਬੀ (Gurmukhi)", type: "string", description: "Leave empty to show the English text on Punjabi pages." }),
  ],
  options: { columns: 2 },
});

export const localeText = defineType({
  name: "localeText",
  title: "Long text (English + Punjabi)",
  type: "object",
  description: "Separate paragraphs with an empty line.",
  fields: [
    defineField({ name: "en", title: "English", type: "text", rows: 5, validation: (r) => r.required() }),
    defineField({ name: "pa", title: "ਪੰਜਾਬੀ (Gurmukhi)", type: "text", rows: 5 }),
  ],
});
