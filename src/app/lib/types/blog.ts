export interface Post {
  slug: string
  title: string
  description: string
  date: string
  author: string
  category: string
  tags: string[]
  image: string
  featured: boolean
  readingTime: string
  content: string
}

export interface Category {
  name: string
  slug: string
  description: string
  count: number
}

export interface PostFrontmatter {
  title: string
  description: string
  date: string
  author?: string
  category: string
  tags: string[]
  image: string
  featured?: boolean
}
