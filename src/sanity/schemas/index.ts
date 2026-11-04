import type { SchemaTypeDefinition } from "sanity";
import * as documents from "./documents";
import * as objects from "./objects";

export const schemaTypes: SchemaTypeDefinition[] = [
  ...Object.values(objects),
  ...Object.values(documents),
];

/** Document types that exist exactly once and cannot be created/deleted. */
export const singletonTypes = new Set<string>(["siteSettings"]);
