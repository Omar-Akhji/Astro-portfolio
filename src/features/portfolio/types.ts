import type { CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">["data"];

export interface FormattedProject {
  readonly title: string;
  readonly category: string;
  readonly image: string;
}
