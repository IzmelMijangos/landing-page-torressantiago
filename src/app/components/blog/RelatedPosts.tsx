import Link from "next/link";
import { Post } from "@/app/lib/types/blog";

interface RelatedPostsProps {
  posts: Post[];
  currentPostSlug: string;
}

export default function RelatedPosts({ posts, currentPostSlug }: RelatedPostsProps) {
  // Filter out current post
  const relatedPosts = posts.filter(post => post.slug !== currentPostSlug).slice(0, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-stone-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">
          Artículos Relacionados
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {relatedPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-stone-200 hover:border-accent"
            >
              {/* Image placeholder */}
              <div className="h-48 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                <span className="text-white text-sm px-4 py-2 bg-accent rounded-full">
                  {post.category}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-accent transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-stone-600 text-sm mb-4 line-clamp-3">
                  {post.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">
                    {new Date(post.date).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="text-accent font-semibold group-hover:translate-x-1 transition-transform inline-block">
                    Leer más →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
