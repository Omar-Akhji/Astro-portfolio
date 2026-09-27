import type { CollectionEntry } from "astro:content";

export type Service = CollectionEntry<"services">["data"];
export type Testimonial = CollectionEntry<"testimonials">["data"];
export type Client = CollectionEntry<"clients">["data"];
export type LanguageSkill = CollectionEntry<"languages">["data"];
