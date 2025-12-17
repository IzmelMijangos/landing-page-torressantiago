import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { getPostBySlug, getAllPostSlugs, getRelatedPosts } from "@/app/lib/utils/blog"
import { generateBlogPostingSchema } from "@/app/lib/utils/seo"
import HeaderRedesign from "@/app/components/redesign/HeaderRedesign"
import Footer from "@/app/components/Footer"
import WhatsAppFloatingButton from "@/app/components/redesign/WhatsAppFloatingButton"
import ShareButton from "@/app/components/blog/ShareButton"
import BreadcrumbsWithSchema from "@/app/components/BreadcrumbsWithSchema"
import { Calendar, Clock, User, Tag, ArrowRight } from "lucide-react"

// Generate static params for all blog posts
export async function generateStaticParams() {
  const slugs = getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post no encontrado",
    }
  }

  const title = `${post.title} | Blog Torres Santiago`
  const url = `https://www.torressantiago.com/blog/${post.slug}`

  return {
    title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title,
      description: post.description,
      url,
      siteName: "Torres Santiago",
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "es_MX",
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.description,
      images: [post.image],
    },
    alternates: {
      canonical: url,
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(post.slug, 3)

  // Generate JSON-LD schema
  const blogPostingSchema = generateBlogPostingSchema({
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.date,
    author: post.author,
    url: `/blog/${post.slug}`,
    keywords: post.tags,
  })

  const shareUrl = `https://www.torressantiago.com/blog/${post.slug}`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />

      <HeaderRedesign />

      <main className="min-h-screen pt-16">
        {/* Article Header */}
        <article>
          <header className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                {/* Breadcrumbs with Schema */}
                <BreadcrumbsWithSchema
                  items={[
                    { label: "Inicio", href: "/" },
                    { label: "Blog", href: "/blog" },
                    { label: post.category, href: `/blog/categoria/${post.category.toLowerCase().replace(/\s+/g, "-")}` },
                    { label: post.title }
                  ]}
                />

                {/* Category Badge */}
                <div className="inline-block bg-accent/20 text-accent text-sm font-semibold px-4 py-2 rounded-full mb-6">
                  {post.category}
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  {post.title}
                </h1>

                {/* Description */}
                <p className="text-xl text-slate-300 mb-8">
                  {post.description}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-6 items-center text-slate-300">
                  <span className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {new Date(post.date).toLocaleDateString("es-MX", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {post.readingTime}
                  </span>
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    <Tag className="w-5 h-5 text-slate-400" />
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-white/10 backdrop-blur-sm text-slate-300 text-sm px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="container mx-auto px-4 -mt-12 mb-12">
            <div className="max-w-5xl mx-auto">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-auto rounded-xl shadow-2xl"
              />
            </div>
          </div>

          {/* Article Content */}
          <div className="container mx-auto px-4 pb-20">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-8 md:p-12 shadow-lg">
                {/* Share Button */}
                <div className="mb-8 flex justify-end">
                  <ShareButton
                    title={post.title}
                    description={post.description}
                    url={shareUrl}
                  />
                </div>

                {/* Markdown Content */}
                <div className="prose prose-lg prose-slate max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h2: ({ children }) => (
                        <h2 className="text-3xl font-bold text-slate-900 mt-12 mb-6">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-stone-700 leading-relaxed mb-6">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-6 mb-6 space-y-2">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-6 mb-6 space-y-2">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-stone-700">{children}</li>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-accent pl-6 italic my-8 text-stone-600">
                          {children}
                        </blockquote>
                      ),
                      code: ({ children }) => (
                        <code className="bg-stone-100 text-accent px-2 py-1 rounded text-sm">
                          {children}
                        </code>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-slate-900 text-white p-6 rounded-lg overflow-x-auto mb-6">
                          {children}
                        </pre>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          className="text-accent hover:text-yellow-600 underline transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>

                {/* Author Bio */}
                <div className="mt-12 pt-8 border-t border-stone-200">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      TS
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {post.author}
                      </h3>
                      <p className="text-stone-600 text-sm">
                        Expertos en desarrollo web, IA y transformación digital. Ayudamos a empresas a crecer con tecnología.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-20 bg-stone-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
                  Artículos Relacionados
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.slug}
                      href={`/blog/${relatedPost.slug}`}
                      className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-stone-200 hover:border-accent"
                    >
                      <div className="h-48 relative overflow-hidden">
                        <img
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <div className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full mb-3">
                          {relatedPost.category}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-accent transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-stone-600 text-sm line-clamp-2">
                          {relatedPost.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              ¿Listo para transformar tu negocio?
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Platiquemos sobre cómo podemos ayudarte con tecnología.
            </p>
            <a
              href="https://wa.me/529516482395?text=Hola,%20le%C3%AD%20el%20art%C3%ADculo%20sobre%20${encodeURIComponent(post.title)}"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-12 py-5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-3"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contactar
            </a>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </>
  )
}
