import type { CollectionEntry } from "astro:content";

export type EducationItem = CollectionEntry<"education">["data"];
export type ExperienceItem = CollectionEntry<"experience">["data"];
export type SkillBar = CollectionEntry<"skills">["data"];
export type TimelineItem = ExperienceItem;

export * from "@/types/resume";
