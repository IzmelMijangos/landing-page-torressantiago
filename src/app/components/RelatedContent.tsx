import Link from "next/link"
import { ArrowRight, LucideIcon } from "lucide-react"
import { servicesData } from "@/app/lib/data/services"
import { caseStudiesData } from "@/app/lib/data/case-studies"
import { getAllPosts } from "@/app/lib/utils/blog"

interface RelatedItem {
  title: string
  description: string
  href: string
  image?: string
  icon?: LucideIcon
  isIcon: boolean
  metadata?: string
}

interface RelatedContentProps {
  type: "service" | "case" | "post"
  tags?: string[]
  category?: string
  exclude?: string // Current item slug to exclude
  limit?: number
  title?: string
}

export default function RelatedContent({
  type,
  tags = [],
  category,
  exclude,
  limit = 3,
  title = "Contenido relacionado",
}: RelatedContentProps) {
  // Get related items based on type
  const getRelatedItems = (): RelatedItem[] => {
    switch (type) {
      case "service": {
        let items = servicesData.filter((s) => s.slug !== exclude)

        // If category provided, prioritize services with matching keywords
        if (category) {
          const categoryLower = category.toLowerCase()
          items = items.sort((a, b) => {
            const aMatch =
              a.title.toLowerCase().includes(categoryLower) ||
              a.description.toLowerCase().includes(categoryLower)
            const bMatch =
              b.title.toLowerCase().includes(categoryLower) ||
              b.description.toLowerCase().includes(categoryLower)
            if (aMatch && !bMatch) return -1
            if (!aMatch && bMatch) return 1
            return 0
          })
        }

        return items.slice(0, limit).map((service) => ({
          title: service.title,
          description: service.description,
          href: `/servicios/${service.slug}`,
          icon: service.icon,
          isIcon: true,
        }))
      }

      case "case": {
        let items = caseStudiesData.filter((c) => c.slug !== exclude)

        // Score by matching tags/industry
        if (tags.length > 0 || category) {
          items = items.sort((a, b) => {
            let scoreA = 0
            let scoreB = 0

            // Match industry
            if (category) {
              if (a.industry?.toLowerCase() === category.toLowerCase()) scoreA += 2
              if (b.industry?.toLowerCase() === category.toLowerCase()) scoreB += 2
            }

            // Match tags (check in title, description, technologies)
            tags.forEach((tag) => {
              const tagLower = tag.toLowerCase()
              if (
                a.title.toLowerCase().includes(tagLower) ||
                a.description.toLowerCase().includes(tagLower) ||
                a.technologies?.some((t) => t.toLowerCase().includes(tagLower))
              ) {
                scoreA += 1
              }
              if (
                b.title.toLowerCase().includes(tagLower) ||
                b.description.toLowerCase().includes(tagLower) ||
                b.technologies?.some((t) => t.toLowerCase().includes(tagLower))
              ) {
                scoreB += 1
              }
            })

            return scoreB - scoreA
          })
        }

        return items.slice(0, limit).map((caseStudy) => ({
          title: caseStudy.title,
          description: caseStudy.tagline,
          href: `/casos-de-estudio/${caseStudy.slug}`,
          image: caseStudy.image,
          isIcon: false,
        }))
      }

      case "post": {
        const allPosts = getAllPosts().filter((p) => p.slug !== exclude)
        let items = allPosts

        // Score by matching tags/category
        if (tags.length > 0 || category) {
          items = items.sort((a, b) => {
            let scoreA = 0
            let scoreB = 0

            // Match category
            if (category && a.category === category) scoreA += 3
            if (category && b.category === category) scoreB += 3

            // Match tags
            tags.forEach((tag) => {
              if (a.tags.includes(tag)) scoreA += 1
              if (b.tags.includes(tag)) scoreB += 1
            })

            return scoreB - scoreA
          })
        }

        return items.slice(0, limit).map((post) => ({
          title: post.title,
          description: post.description,
          href: `/blog/${post.slug}`,
          image: post.image,
          isIcon: false,
          metadata: `${post.category} · ${post.readingTime}`,
        }))
      }

      default:
        return []
    }
  }

  const relatedItems = getRelatedItems()

  if (relatedItems.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-stone-50 rounded-xl">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
          {title}
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-stone-200 hover:border-accent"
            >
              {item.isIcon && item.icon ? (
                <div className="h-40 flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-50">
                  <item.icon className="w-16 h-16 text-accent" />
                </div>
              ) : item.image ? (
                <div className="h-40 relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ) : null}

              <div className="p-6">
                <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-accent transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>

                {item.metadata && (
                  <p className="text-xs text-stone-500 mb-3">{item.metadata}</p>
                )}

                <div className="flex items-center text-accent font-semibold text-sm">
                  <span>Ver más</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
