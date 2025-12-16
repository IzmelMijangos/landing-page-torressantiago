import fs from "fs"
import path from "path"
import matter from "gray-matter"
import readingTime from "reading-time"
import { Post, PostFrontmatter, Category } from "../types/blog"

const postsDirectory = path.join(process.cwd(), "content/blog")

/**
 * Get all blog posts
 */
export function getAllPosts(): Post[] {
  // Check if directory exists
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith(".mdx") || fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, "")
      return getPostBySlug(slug)
    })
    .filter((post): post is Post => post !== null)

  // Sort posts by date (newest first)
  return allPosts.sort((a, b) => {
    if (new Date(a.date) < new Date(b.date)) {
      return 1
    }
    return -1
  })
}

/**
 * Get a single post by slug
 */
export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)

    // Try .mdx first, then .md
    let fileContents: string
    if (fs.existsSync(fullPath)) {
      fileContents = fs.readFileSync(fullPath, "utf8")
    } else {
      const mdPath = path.join(postsDirectory, `${slug}.md`)
      if (fs.existsSync(mdPath)) {
        fileContents = fs.readFileSync(mdPath, "utf8")
      } else {
        return null
      }
    }

    const { data, content } = matter(fileContents)
    const frontmatter = data as PostFrontmatter

    // Calculate reading time
    const stats = readingTime(content)

    return {
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      author: frontmatter.author || "Torres Santiago",
      category: frontmatter.category,
      tags: frontmatter.tags || [],
      image: frontmatter.image,
      featured: frontmatter.featured || false,
      readingTime: stats.text,
      content,
    }
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
}

/**
 * Get all post slugs
 */
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx") || fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.mdx?$/, ""))
}

/**
 * Get posts by category
 */
export function getPostsByCategory(category: string): Post[] {
  const allPosts = getAllPosts()
  return allPosts.filter(
    (post) => post.category.toLowerCase() === category.toLowerCase()
  )
}

/**
 * Get featured posts
 */
export function getFeaturedPosts(limit: number = 3): Post[] {
  const allPosts = getAllPosts()
  return allPosts.filter((post) => post.featured).slice(0, limit)
}

/**
 * Get all categories with post counts
 */
export function getAllCategories(): Category[] {
  const allPosts = getAllPosts()
  const categoryMap = new Map<string, number>()

  allPosts.forEach((post) => {
    const count = categoryMap.get(post.category) || 0
    categoryMap.set(post.category, count + 1)
  })

  return Array.from(categoryMap.entries()).map(([name, count]) => ({
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    description: `Artículos sobre ${name}`,
    count,
  }))
}

/**
 * Get related posts by tags
 */
export function getRelatedPosts(currentSlug: string, limit: number = 3): Post[] {
  const currentPost = getPostBySlug(currentSlug)
  if (!currentPost) return []

  const allPosts = getAllPosts().filter((post) => post.slug !== currentSlug)

  // Score posts by number of matching tags
  const scoredPosts = allPosts.map((post) => {
    const matchingTags = post.tags.filter((tag) =>
      currentPost.tags.includes(tag)
    ).length
    const sameCategory = post.category === currentPost.category ? 1 : 0
    return {
      post,
      score: matchingTags * 2 + sameCategory,
    }
  })

  // Sort by score and return top results
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post)
}
