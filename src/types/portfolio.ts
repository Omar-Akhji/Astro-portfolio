import type { CollectionEntry } from "astro:content";

export type Service = CollectionEntry<"services">["data"];
export type Testimonial = CollectionEntry<"testimonials">["data"];
export type Project = CollectionEntry<"projects">["data"];
export type Client = CollectionEntry<"clients">["data"];
export type LanguageSkill = CollectionEntry<"languages">["data"];
export type BlogPost = CollectionEntry<"blog">["data"];
export type TimelineItem = CollectionEntry<"experience">["data"];
export type SkillBar = CollectionEntry<"skills">["data"];
