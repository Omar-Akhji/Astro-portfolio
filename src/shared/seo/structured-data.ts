import {
  AUTHOR_EMAIL,
  AUTHOR_GITHUB,
  AUTHOR_LINKEDIN,
  AUTHOR_NAME,
  AUTHOR_PHONE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "../constants/seo";
import type { BreadcrumbItem } from "../types/seo";

export function buildPersonSchema(siteUrl: string = SITE_URL): Record<string, unknown> {
  return {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: AUTHOR_NAME,
    jobTitle: "Full Stack Web Developer",
    url: siteUrl,
    image: `${siteUrl}/assets/avatar/oa-avatar.png`,
    email: AUTHOR_EMAIL,
    telephone: AUTHOR_PHONE,
    address: { "@type": "PostalAddress", addressLocality: "Rabat", addressCountry: "Morocco" },
    sameAs: [AUTHOR_GITHUB, AUTHOR_LINKEDIN],
    knowsAbout: [
      "JavaScript",
      "TypeScript",
      "React",
      "Astro",
      "Node.js",
      "Python",
      "SQL",
      "Web Architecture",
      "Full Stack Development",
    ],
  };
}

export function buildWebsiteSchema(siteUrl: string = SITE_URL): Record<string, unknown> {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: `${siteUrl}/`,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "en-US",
    publisher: { "@id": `${siteUrl}/#person` },
  };
}

export function buildBreadcrumbSchema(
  canonicalUrl: string,
  breadcrumbs: readonly BreadcrumbItem[],
): Record<string, unknown> {
  return {
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
}
