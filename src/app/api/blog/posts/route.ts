import { NextResponse } from 'next/server'
import { getAllPosts } from '@/app/lib/utils/blog'

export const dynamic = 'force-dynamic'

// GET: Obtener todos los posts del blog
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = searchParams.get('limit')

    let posts = getAllPosts()

    // Limitar cantidad si se especifica
    if (limit) {
      const limitNum = parseInt(limit, 10)
      posts = posts.slice(0, limitNum)
    }

    return NextResponse.json({
      success: true,
      posts: posts.map(post => ({
        slug: post.slug,
        title: post.title,
        description: post.description,
        date: post.date,
        category: post.category,
        author: post.author,
        image: post.image,
        featured: post.featured,
        readingTime: post.readingTime
      })),
      count: posts.length
    })
  } catch (error: any) {
    console.error('Error al obtener posts:', error)
    return NextResponse.json(
      { error: 'Error al obtener posts', details: error.message },
      { status: 500 }
    )
  }
}
