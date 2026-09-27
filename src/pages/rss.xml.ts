import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@shared/constants/seo";

export const prerender = true;

export const GET: APIRoute = async (context) => {
  const blog = await getCollection("blog");
  const sortedPosts = blog.toSorted(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );

  const site = context.site?.href ?? SITE_URL;

  return rss({
    title: `${SITE_NAME} | Tech Blog & Insights`,
    description: SITE_DESCRIPTION,
    site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.text,
      link: `/blog/${post.id}/`,
      categories: [post.data.category, ...post.data.tags],
    })),
    customData: `<language>en-us</language>`,
  });
};
