import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { structure } from "./structure";

/**
 * Indi Radio Studio. Run `npm run dev` here, or deploy with `npm run deploy`
 * (hosted at https://indiradio.sanity.studio). See docs/05-admin-guide.md.
 */
export default defineConfig({
  name: "indi-radio",
  title: "Indi Radio",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "REPLACE_WITH_PROJECT_ID",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
});
