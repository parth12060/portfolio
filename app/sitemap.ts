import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog";
import { site } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...["", "/work", "/projects", "/blog"].map((path) => ({ url: `${site.url}${path}` })),
    ...posts.map((post) => ({ url: `${site.url}/blog/${post.slug}`, lastModified: post.updated ?? post.date })),
  ];
}
