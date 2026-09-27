import { defineCollection } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.string(),
      date: z.string(),
      dateTime: z.string(),
      image: z.union([image(), z.string()]),
      text: z.string(),
      tags: z.array(z.string()).default([]),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.string(),
      image: image(),
      github: z.url().nullable().optional(),
      live: z.url().nullable().optional(),
      order: z.number(),
      tags: z.array(z.string()).default([]),
      description: z.string(),
    }),
});

const services = defineCollection({
  loader: file("src/features/about/data/services.json"),
  schema: z.object({
    id: z.string(),
    icon: z.string(),
    title: z.string(),
    description: z.string(),
  }),
});

const testimonials = defineCollection({
  loader: file("src/features/about/data/testimonials.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string(),
    text: z.string(),
    date: z.string(),
  }),
});

const languages = defineCollection({
  loader: file("src/features/about/data/languages.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    order: z.number().optional(),
    url: z.string().optional(),
    icon: z.string().optional(),
  }),
});

const clients = defineCollection({
  loader: file("src/features/about/data/clients.json"),
  schema: z.object({ id: z.string(), logo: z.string(), alt: z.string() }),
});

const education = defineCollection({
  loader: file("src/features/resume/data/education.json"),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    period: z.string(),
    description: z.string(),
  }),
});

const experience = defineCollection({
  loader: file("src/features/resume/data/experience.json"),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    period: z.string(),
    description: z.string(),
  }),
});

const skills = defineCollection({
  loader: file("src/features/resume/data/skills.json"),
  schema: z.object({ id: z.string(), name: z.string(), percentage: z.number() }),
});

export const collections = {
  blog,
  projects,
  services,
  testimonials,
  languages,
  clients,
  education,
  experience,
  skills,
};
