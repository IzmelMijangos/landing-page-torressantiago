import Link from "next/link";
import { getAllCategories, getAllPosts } from "@/app/lib/utils/blog";
import { Calendar, ArrowRight } from "lucide-react";

interface BlogSidebarProps {
  currentCategory?: string;
  showRecentPosts?: boolean;
}

export default function BlogSidebar({ currentCategory, showRecentPosts = false }: BlogSidebarProps) {
  const categories = getAllCategories();
  const recentPosts = showRecentPosts ? getAllPosts().slice(0, 5) : [];

  // Category descriptions map
  const categoryDescriptions: Record<string, string> = {
    "Desarrollo Web": "Aprende sobre desarrollo web profesional, tecnologías modernas y mejores prácticas para crear sitios y aplicaciones web de alto rendimiento.",
    "Inteligencia Artificial": "Descubre cómo la IA puede transformar tu negocio con automatización, chatbots y soluciones inteligentes que ahorran tiempo y dinero.",
    "Ciberseguridad": "Protege tu empresa con guías prácticas sobre seguridad digital, prevención de amenazas y cumplimiento normativo para PyMEs.",
    "Datos": "Gestión, tratamiento y análisis de datos para tomar decisiones informadas y cumplir con regulaciones de privacidad.",
  };

  return (
    <aside className="space-y-6">
      {/* Categories */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-stone-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="text-accent">📂</span>
          Categorías
        </h3>
        {categories.length === 0 ? (
          <p className="text-stone-600 text-sm">No hay categorías aún</p>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/blog/categoria/${category.slug}`}
                className={`flex items-center justify-between p-3 rounded-lg transition-all group ${
                  currentCategory === category.slug
                    ? "bg-accent/10 text-accent font-semibold"
                    : "hover:bg-stone-50"
                }`}
              >
                <span className={`text-sm ${
                  currentCategory === category.slug
                    ? "text-accent"
                    : "text-stone-700 group-hover:text-accent"
                } transition-colors`}>
                  {category.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-stone-200 text-stone-600 px-2 py-1 rounded-full font-medium">
                    {category.count}
                  </span>
                  <ArrowRight className={`w-4 h-4 ${
                    currentCategory === category.slug
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  } transition-opacity`} />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View All Link */}
        {currentCategory && (
          <Link
            href="/blog"
            className="block mt-4 pt-4 border-t border-stone-200 text-center text-sm text-accent hover:text-yellow-600 font-semibold transition-colors"
          >
            Ver todos los artículos →
          </Link>
        )}
      </div>

      {/* Recent Posts (Optional) */}
      {showRecentPosts && recentPosts.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-stone-200">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-accent">🔥</span>
            Artículos Recientes
          </h3>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block group"
              >
                <h4 className="text-sm font-semibold text-slate-900 group-hover:text-accent transition-colors line-clamp-2 mb-1">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(post.date).toLocaleDateString("es-MX", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTA Card */}
      <div className="bg-gradient-to-br from-accent to-yellow-600 rounded-xl p-6 text-white shadow-lg">
        <h3 className="text-xl font-bold mb-3">¿Necesitas ayuda con tu proyecto?</h3>
        <p className="text-sm mb-4 text-white/90 leading-relaxed">
          Platiquemos sobre cómo podemos ayudarte a transformar tu negocio con tecnología.
        </p>
        <a
          href="https://wa.me/529516482395?text=Hola,%20me%20interesa%20una%20consultor%C3%ADa"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-white text-accent text-center font-semibold py-3 rounded-lg hover:bg-stone-50 transition-all hover:shadow-md"
        >
          Contactar por WhatsApp
        </a>
        <p className="text-xs mt-3 text-white/70 text-center">
          📞 Respuesta en menos de 1 hora
        </p>
      </div>

      {/* Category Info Card (when viewing a category) */}
      {currentCategory && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-lg">
          <h3 className="text-lg font-bold mb-2">
            {categories.find((c) => c.slug === currentCategory)?.name}
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {categoryDescriptions[categories.find((c) => c.slug === currentCategory)?.name || ""] ||
              "Artículos sobre esta temática"}
          </p>
        </div>
      )}
    </aside>
  );
}
