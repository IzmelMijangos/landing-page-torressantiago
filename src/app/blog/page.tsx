import { Metadata } from "next"
import Link from "next/link"
import { getAllPosts, getFeaturedPosts } from "@/app/lib/utils/blog"
import { generatePageMetadata } from "@/app/lib/utils/seo"
import HeaderRedesign from "@/app/components/redesign/HeaderRedesign"
import Footer from "@/app/components/Footer"
import BreadcrumbsWithSchema from "@/app/components/BreadcrumbsWithSchema"
import BlogSidebar from "@/app/components/blog/BlogSidebar"
import { Calendar, Clock, ArrowRight } from "lucide-react"

export const metadata: Metadata = generatePageMetadata({
  title: "Blog de Desarrollo Web y Tecnología",
  description: "Artículos sobre desarrollo web, inteligencia artificial, ciberseguridad, automatización y transformación digital para tu negocio.",
  path: "/blog",
  keywords: ["blog", "desarrollo web", "IA", "ciberseguridad", "automatización", "tecnología"],
})

export default function BlogPage() {
  const allPosts = getAllPosts()
  const featuredPosts = getFeaturedPosts(1)
  const regularPosts = allPosts.filter((post) => !post.featured)

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
                  { label: "Blog" }
                ]}
              />

              <div className="text-center mt-8">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Blog de Tecnología
                </h1>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  Conocimiento, tendencias y mejores prácticas en desarrollo web, IA y tecnología para hacer crecer tu negocio
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-8">
              {/* Main Posts Area */}
              <div className="lg:col-span-3">
                {/* Featured Post */}
                {featuredPosts.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Destacado</h2>
                    <Link
                      href={`/blog/${featuredPosts[0].slug}`}
                      className="group block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-stone-200 hover:border-accent"
                    >
                      <div className="md:flex">
                        <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                          <img
                            src={featuredPosts[0].image}
                            alt={featuredPosts[0].title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="md:w-1/2 p-8">
                          <div className="inline-block bg-accent/10 text-accent text-sm font-semibold px-3 py-1 rounded-full mb-4">
                            {featuredPosts[0].category}
                          </div>
                          <h3 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-accent transition-colors">
                            {featuredPosts[0].title}
                          </h3>
                          <p className="text-stone-600 mb-6 line-clamp-3">
                            {featuredPosts[0].description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-stone-500 mb-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(featuredPosts[0].date).toLocaleDateString("es-MX", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {featuredPosts[0].readingTime}
                            </span>
                          </div>
                          <div className="flex items-center text-accent font-semibold group-hover:translate-x-2 transition-transform">
                            <span>Leer artículo</span>
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Posts Grid */}
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Artículos Recientes</h2>
                  {regularPosts.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center">
                      <p className="text-stone-600 text-lg">
                        Próximamente publicaremos artículos sobre desarrollo web, IA, ciberseguridad y más.
                      </p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {regularPosts.map((post) => (
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
                            <div className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full mb-3">
                              {post.category}
                            </div>
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
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-20">
                  <BlogSidebar showRecentPosts={false} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
