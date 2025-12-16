import { NextResponse } from "next/server"
import { getAllPosts } from "@/app/lib/utils/blog"

export async function GET() {
  const posts = getAllPosts()
  const siteUrl = "https://www.torressantiago.com"

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Torres Santiago - Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Artículos sobre desarrollo web, inteligencia artificial, ciberseguridad y transformación digital</description>
    <language>es-MX</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>contacto.torressantiago@gmail.com (${post.author})</author>
      <category>${post.category}</category>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      ${post.image ? `<enclosure url="${post.image.startsWith("http") ? post.image : siteUrl + post.image}" type="image/jpeg"/>` : ""}
    </item>`
      )
      .join("")}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  })
}
