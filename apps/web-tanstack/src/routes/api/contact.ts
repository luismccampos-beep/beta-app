import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { checkRateLimit, publicRatelimit } from '@/lib/rate-limit'
import { Resend } from 'resend'

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
  type: z.enum(['general', 'support', 'partnership', 'feedback']).default('general'),
})

export const Route = createFileRoute('/api/contact')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rateLimitResult = await checkRateLimit(request, publicRatelimit)
        if (!rateLimitResult.success) {
          return Response.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 })
        }

        try {
          const body = await request.json()
          const data = contactSchema.parse(body)

          const resendApiKey = process.env.RESEND_API_KEY
          if (resendApiKey) {
            const resend = new Resend(resendApiKey)
            await resend.emails.send({
              from: 'AKMLEVA Contact <noreply@akmleva.pt>',
              to: 'support@akmleva.pt',
              subject: `[${data.type}] ${data.subject}`,
              html: `
                <h2>New contact form submission</h2>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Type:</strong> ${data.type}</p>
                <p><strong>Subject:</strong> ${data.subject}</p>
                <hr />
                <p>${data.message.replace(/\n/g, '<br/>')}</p>
              `,
            })
          }

          return Response.json({ ok: true, message: 'Message sent successfully' })
        } catch (error) {
          if (error instanceof z.ZodError) {
            return Response.json({ ok: false, error: 'Validation failed', issues: error.issues }, { status: 400 })
          }
          console.error('[contact]', error)
          return Response.json({ ok: false, error: 'Failed to send message' }, { status: 500 })
        }
      },
    },
  },
})
