import { Metadata } from "next"
import Link from "next/link"
import { getPostsByCategory, getAllCategories } from "@/app/lib/utils/blog"
import { generatePageMetadata } from "@/app/lib/utils/seo"
import HeaderRedesign from "@/app/components/redesign/HeaderRedesign"
import Footer from "@/app/components/Footer"
import WhatsAppFloatingButton from "@/app/components/redesign/WhatsAppFloatingButton"
import BreadcrumbsWithSchema from "@/app/components/BreadcrumbsWithSchema"
import BlogSidebar from "@/app/components/blog/BlogSidebar"
import { Calendar, Clock, ArrowLeft } from "lucide-react"

// Generate static params for all categories
export async function generateStaticParams() {
  const categories = getAllCategories()
  return categories.map((category) => ({
    categoria: category.slug,
  }))
}

// Generate metadata dynamically
export async function generateMetadata({ params }: { params: { categoria: string } }): Promise<Metadata> {
  const categorySlug = params.categoria
  const allCategories = getAllCategories()
  const category = allCategories.find((c) => c.slug === categorySlug)

  if (!category) {
    return {
      title: "Categoría no encontrada",
    }
  }

  return generatePageMetadata({
    title: `${category.name} - Blog`,
    description: `Artículos sobre ${category.name}. ${category.description}`,
    path: `/blog/categoria/${categorySlug}`,
    keywords: [category.name, "blog", "artículos", "tecnología"],
  })
}

export default function CategoryPage({ params }: { params: { categoria: string } }) {
  const categorySlug = params.categoria
  const allCategories = getAllCategories()
  const category = allCategories.find((c) => c.slug === categorySlug)

  if (!category) {
    return (
      <>
        <HeaderRedesign />
        <main className="min-h-screen pt-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Categoría no encontrada
            </h1>
            <Link
              href="/blog"
              className="text-accent hover:text-yellow-600 transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const posts = getPostsByCategory(category.name)

  return (
    <>
      <HeaderRedesign />
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              {/* Breadcrumbs */}
              <BreadcrumbsWithSchema
                items={[
                  { label: "Inicio", href: "/" },
                  { label: "Blog", href: "/blog" },
                  { label: category.name }
                ]}
              />

              <div className="mt-8">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-6"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Volver al blog
                </Link>

                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  {category.name}
                </h1>
                <p className="text-xl text-slate-300 max-w-3xl">
                  {category.description} · {category.count} {category.count === 1 ? "artículo" : "artículos"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Posts Grid with Sidebar */}
        <section className="py-20 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-8">
              {/* Main Posts Area */}
              <div className="lg:col-span-3">
                {posts.length === 0 ? (
                  <div className="bg-white rounded-xl p-12 text-center">
                    <p className="text-stone-600 text-lg">
                      No hay artículos en esta categoría todavía.
                    </p>
                    <Link
                      href="/blog"
                      className="inline-block mt-6 text-accent hover:text-yellow-600 font-semibold transition-colors"
                    >
                      Ver todos los artículos
                    </Link>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {posts.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-stone-200 hover:border-accent"
                      >
                        <div className="h-48 relative overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-accent transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                            {post.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-stone-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.date).toLocaleDateString("es-MX", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.readingTime}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-20">
                  <BlogSidebar currentCategory={categorySlug} showRecentPosts={true} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Other Categories */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">
                Otras Categorías
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {allCategories
                  .filter((c) => c.slug !== categorySlug)
                  .map((otherCategory) => (
                    <Link
                      key={otherCategory.slug}
                      href={`/blog/categoria/${otherCategory.slug}`}
                      className="bg-stone-100 hover:bg-accent/10 text-stone-700 hover:text-accent px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      {otherCategory.name} ({otherCategory.count})
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </>
  )
}
