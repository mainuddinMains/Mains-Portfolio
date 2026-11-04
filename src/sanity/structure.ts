import type { StructureResolver } from "sanity/structure";
import { singletonTypes } from "./schemas";

/** Studio sidebar: site settings as a singleton, then each content type. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !singletonTypes.has(item.getId() ?? "")),
    ]);
