import { NextResponse } from 'next/server'

interface PostPreview {
  slug: string
  title: string
  url: string
  description: string
}

// POST: Preview del newsletter
export async function POST(req: Request) {
  try {
    const { postSlugs, subject, customMessage } = await req.json()

    if (!postSlugs || postSlugs.length === 0) {
      return NextResponse.json(
        { error: 'Debes seleccionar al menos un post' },
        { status: 400 }
      )
    }

    // Crear posts de ejemplo (en producción estos vendrían de tu sistema de blog)
    const posts: PostPreview[] = postSlugs.map((slug: string) => ({
      slug,
      title: slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.torressantiago.com'}/blog/${slug}`,
      description: 'Descripción del artículo...'
    }))

    const postsHTML = posts.map((post: PostPreview) => `
      <div style="background-color: #f9f9f9; border-left: 4px solid #c17207; padding: 15px; margin: 15px 0; border-radius: 5px;">
        <h3 style="margin: 0 0 10px 0; color: #333;">
          <a href="${post.url}" style="color: #c17207; text-decoration: none;">
            ${post.title}
          </a>
        </h3>
        <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
          ${post.description}
        </p>
        <a href="${post.url}" style="color: #c17207; text-decoration: none; font-size: 14px; font-weight: 600;">
          Leer artículo →
        </a>
      </div>
    `).join('')

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #c17207 0%, #f59e0b 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Torres Santiago</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Soluciones Tecnológicas</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 20px;">
            <p style="color: #333; line-height: 1.6; font-size: 16px;">
              Hola [Nombre del Suscriptor],
            </p>

            ${customMessage ? `
              <div style="background-color: #fff5e6; border-left: 4px solid #c17207; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #666; font-size: 15px;">
                  ${customMessage}
                </p>
              </div>
            ` : ''}

            <p style="color: #333; line-height: 1.6; font-size: 16px;">
              Tenemos nuevo contenido que creemos te va a interesar:
            </p>

            <!-- Posts -->
            ${postsHTML}

            <!-- CTA -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.torressantiago.com'}/blog"
                 style="display: inline-block; background-color: #c17207; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                Ver todos los artículos
              </a>
            </div>

            <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 30px;">
              ¿Necesitas ayuda con un proyecto de tecnología? Responde este email o contáctanos por WhatsApp.
            </p>

            <p style="color: #333; margin-top: 30px;">
              ¡Saludos!<br>
              <strong>El equipo de Torres Santiago</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9f9f9; padding: 30px 20px; border-top: 1px solid #eee;">
            <div style="text-align: center; color: #999; font-size: 12px;">
              <p style="margin: 0 0 10px 0;">
                Torres Santiago - Oaxaca, México<br>
                <a href="https://www.torressantiago.com" style="color: #c17207; text-decoration: none;">www.torressantiago.com</a>
              </p>
              <p style="margin: 10px 0;">
                WhatsApp: <a href="https://wa.me/529513183885" style="color: #c17207; text-decoration: none;">+52 951 318 3885</a>
              </p>
              <p style="margin: 15px 0 0 0;">
                <a href="#" style="color: #999; text-decoration: underline; font-size: 11px;">
                  Cancelar suscripción
                </a>
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    return NextResponse.json({
      success: true,
      html,
      subject: subject || 'Nuevos artículos de Torres Santiago',
      posts
    })
  } catch (error: any) {
    console.error('Error al generar preview:', error)
    return NextResponse.json(
      { error: 'Error al generar preview', details: error.message },
      { status: 500 }
    )
  }
}
