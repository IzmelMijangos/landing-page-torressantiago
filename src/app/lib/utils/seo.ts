import { Metadata } from "next"

/**
 * Genera un slug URL-friendly a partir de un texto
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Elimina acentos
    .replace(/[^a-z0-9]+/g, "-") // Reemplaza caracteres no alfanuméricos con -
    .replace(/^-+|-+$/g, "") // Elimina guiones al inicio y final
}

/**
 * Genera metadata dinámica para páginas
 */
export interface GenerateMetadataParams {
  title: string
  description: string
  path?: string
  image?: string
  keywords?: string[]
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  author?: string
}

export function generatePageMetadata({
  title,
  description,
  path = "/",
  image = "/images/og-homepage.jpg",
  keywords = [],
  type = "website",
  publishedTime,
  modifiedTime,
  author,
}: GenerateMetadataParams): Metadata {
  const siteUrl = "https://www.torressantiago.com"
  const fullUrl = `${siteUrl}${path}`
  const fullImageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.length > 0 ? keywords.join(", ") : undefined,
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "Torres Santiago",
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "es_MX",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImageUrl],
    },
    alternates: {
      canonical: fullUrl,
    },
  }

  // Agregar metadatos específicos para artículos
  if (type === "article" && publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article",
      publishedTime,
      modifiedTime,
      authors: author ? [author] : undefined,
    }
  }

  return metadata
}

/**
 * Genera JSON-LD schema para breadcrumbs
 */
export interface BreadcrumbItem {
  name: string
  url: string
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  const siteUrl = "https://www.torressantiago.com"

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
    })),
  }
}

/**
 * Genera JSON-LD schema extendido para servicios
 */
export interface ServiceSchemaParams {
  name: string
  description: string
  price?: string
  priceCurrency?: string
  areaServed?: string
  url?: string
  image?: string
}

export function generateServiceSchema({
  name,
  description,
  price,
  priceCurrency = "MXN",
  areaServed = "MX",
  url,
  image,
}: ServiceSchemaParams) {
  const siteUrl = "https://www.torressantiago.com"

  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: "Torres Santiago Soluciones Inteligentes",
      url: siteUrl,
    },
    areaServed: {
      "@type": "Country",
      name: areaServed,
    },
  }

  if (url) {
    schema.url = url.startsWith("http") ? url : `${siteUrl}${url}`
  }

  if (image) {
    schema.image = image.startsWith("http") ? image : `${siteUrl}${image}`
  }

  if (price && price !== "Gratis") {
    // Extraer número del precio (ejemplo: "$7,999" -> "7999")
    const numericPrice = price.replace(/[^0-9]/g, "")

    schema.offers = {
      "@type": "Offer",
      price: numericPrice,
      priceCurrency,
      availability: "https://schema.org/InStock",
    }
  }

  return schema
}

/**
 * Genera JSON-LD schema para CreativeWork (casos de estudio)
 */
export interface CreativeWorkSchemaParams {
  name: string
  description: string
  url?: string
  image?: string
  datePublished?: string
  keywords?: string[]
  about?: string
}

export function generateCreativeWorkSchema({
  name,
  description,
  url,
  image,
  datePublished,
  keywords = [],
  about,
}: CreativeWorkSchemaParams) {
  const siteUrl = "https://www.torressantiago.com"

  const schema: any = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    creator: {
      "@type": "Organization",
      name: "Torres Santiago Soluciones Inteligentes",
      url: siteUrl,
    },
  }

  if (url) {
    schema.url = url.startsWith("http") ? url : `${siteUrl}${url}`
  }

  if (image) {
    schema.image = image.startsWith("http") ? image : `${siteUrl}${image}`
  }

  if (datePublished) {
    schema.datePublished = datePublished
  }

  if (keywords.length > 0) {
    schema.keywords = keywords.join(", ")
  }

  if (about) {
    schema.about = about
  }

  return schema
}

/**
 * Genera JSON-LD schema para BlogPosting
 */
export interface BlogPostingSchemaParams {
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  author?: string
  url: string
  keywords?: string[]
}

export function generateBlogPostingSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author = "Torres Santiago",
  url,
  keywords = [],
}: BlogPostingSchemaParams) {
  const siteUrl = "https://www.torressantiago.com"

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    image: image.startsWith("http") ? image : `${siteUrl}${image}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "Torres Santiago Soluciones Inteligentes",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    url: url.startsWith("http") ? url : `${siteUrl}${url}`,
    keywords: keywords.join(", "),
  }
}

/**
 * Genera JSON-LD schema para FAQPage
 */
export interface FAQItem {
  question: string
  answer: string
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}
