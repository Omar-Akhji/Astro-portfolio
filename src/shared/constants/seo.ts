/**
 * Single source of truth for portfolio SEO identity & metadata. Centralizes site identity,
 * canonical origin, and Google Search Console tokens.
 */

export const SITE_URL =
  import.meta.env["SITE_URL"]
  || (import.meta.env.SITE ? import.meta.env.SITE.replace(/\/$/, "") : "https://omarakhji.dev");

export const SITE_NAME = "Omar Akhji";
export const SITE_TITLE_DEFAULT = "Omar Akhji — Full Stack Web Developer";
export const SITE_TITLE_TEMPLATE = "%s | Omar Akhji";

export const SITE_DESCRIPTION =
  "Full Stack Web Developer based in Rabat, Morocco. Specializing in high-performance web applications with React, Astro, Node.js, TypeScript, and Python. Explore projects, resume, and technical articles.";

export const SITE_KEYWORDS = [
  "Omar Akhji",
  "Full Stack Developer",
  "Web Developer",
  "Frontend Engineer",
  "Backend Engineer",
  "Astro Developer",
  "React Developer",
  "TypeScript",
  "Node.js",
  "Python",
  "Rabat Morocco Developer",
  "Software Engineer Projects",
];

export const AUTHOR_NAME = "Omar Akhji";
export const AUTHOR_EMAIL = "omar.akhji@um5r.ac.ma";
export const AUTHOR_PHONE = "+212 7 66 43 68 62";
export const AUTHOR_LOCATION = "Rabat, Morocco";
export const AUTHOR_GITHUB = "https://github.com/omar-akhji";
export const AUTHOR_LINKEDIN = "https://linkedin.com/in/omar-akhji";
export const AUTHOR_TWITTER = "@omarakhji";

export const SITE_LOCALE = "en_US";

export const OG_IMAGE_PATH = "/og-image.png";
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/**
 * Google Search Console Verification Token. Can be provided via GOOGLE_SITE_VERIFICATION in .env or
 * hardcoded when received from GSC.
 */
export const GOOGLE_SITE_VERIFICATION = import.meta.env["GOOGLE_SITE_VERIFICATION"] || "";
