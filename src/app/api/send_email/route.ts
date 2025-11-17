import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(req: Request) {
  const body = await req.json()

  const brevoAPIKey = process.env.BREVO_API_KEY
  const brevoUrl = 'https://api.brevo.com/v3/smtp/email'

  const emailPayload = {
    sender: { name: "Torres Santiago SI", email: "contacto.torressantiago@gmail.com" },
    to: [{ email: "contacto.torressantiago@gmail.com", name: "Contacto TS" }],
    subject: "Nueva solicitud de cotización",
    htmlContent: `
      <h2>Solicitud de Cotización</h2>
      <p><strong>Nombre:</strong> ${body.name}</p>
      <p><strong>Email:</strong> ${body.email}</p>
      <p><strong>Servicio:</strong> ${body.serviceType}</p>
      <p><strong>Descripción:</strong> ${body.description}</p>
    `,
    textContent: `
      Solicitud de Cotización
      Nombre: ${body.name}
      Email: ${body.email}
      Servicio: ${body.serviceType}
      Descripción: ${body.description}
    `
  }

  try {
    const response = await axios.post(brevoUrl, emailPayload, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoAPIKey || '',
      },
    })
  
    return NextResponse.json({ success: true }, { status: 200 })
  }  catch (error: any) {
    return NextResponse.json({ error: 'No se pudo enviar el correo.' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ping: 'pong' })
}
