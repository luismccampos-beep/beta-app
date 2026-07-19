import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY

if (!resendApiKey) {
  console.warn('[email] RESEND_API_KEY not set. Emails will not be sent.')
}

const resend = resendApiKey ? new Resend(resendApiKey) : null

export const EMAIL_FROM = process.env.EMAIL_FROM || 'AKMLEVA <no-reply@akmleva.pt>'

const BASE_URL = process.env.VITE_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'

function emailTemplate(opts: { title: string; subtitle: string; body: string; button?: { text: string; url: string } }) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#0d9488,#f97316);padding:32px 24px;text-align:center;">
      <h1 style="color:#fff;font-size:24px;margin:0;font-weight:700;">AKMLEVA</h1>
      <p style="color:rgba(255,255,255,0.9);font-size:14px;margin:8px 0 0;">${opts.subtitle}</p>
    </div>
    <div style="padding:32px 24px;">
      <h2 style="font-size:18px;color:#18181b;margin:0 0 16px;">${opts.title}</h2>
      <div style="font-size:14px;color:#52525b;line-height:1.6;margin:0 0 24px;">${opts.body}</div>
      ${opts.button ? `
      <div style="text-align:center;margin:0 0 24px;">
        <a href="${opts.button.url}" style="display:inline-block;background:#0d9488;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:600;">
          ${opts.button.text}
        </a>
      </div>` : ''}
      <p style="font-size:13px;color:#a1a1aa;line-height:1.5;margin:0;">
        Se o botão não funcionar, copie e cole este URL no navegador:<br>
        <a href="${opts.button?.url ?? '#'}" style="color:#0d9488;word-break:break-all;">${opts.button?.url ?? ''}</a>
      </p>
    </div>
    <div style="padding:16px 24px;background:#fafafa;border-top:1px solid #e4e4e7;">
      <p style="font-size:12px;color:#a1a1aa;margin:0;text-align:center;">© ${new Date().getFullYear()} AKMLEVA. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>`
}

export async function sendVerificationEmail({ to, token }: { to: string; token: string }) {
  if (!resend) return { success: false, error: 'Email service not configured' }

  const url = `${BASE_URL}/auth/verify-email?token=${token}`
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: 'Verifique o seu email AKMLEVA',
      html: emailTemplate({
        title: 'Verifique o seu email',
        subtitle: 'Verificação de Email',
        body: 'Obrigado por se registar na AKMLEVA. Clique no botão abaixo para verificar o seu email e ativar a sua conta. Este link expira em 24 horas.',
        button: { text: 'Verificar Email', url },
      }),
    })
    return { success: true }
  } catch (error) {
    console.error('[email] Failed to send verification:', error)
    return { success: false, error: String(error) }
  }
}

export async function sendPasswordResetEmail({ to, token }: { to: string; token: string }) {
  if (!resend) return { success: false, error: 'Email service not configured' }

  const url = `${BASE_URL}/auth/reset-password?token=${token}`
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: 'Recuperar password AKMLEVA',
      html: emailTemplate({
        title: 'Recuperar a sua password',
        subtitle: 'Recuperação de Password',
        body: 'Recebemos um pedido para repor a sua password. Clique no botão abaixo para escolher uma nova password. Este link expira em 1 hora.',
        button: { text: 'Repor Password', url },
      }),
    })
    return { success: true }
  } catch (error) {
    console.error('[email] Failed to send password reset:', error)
    return { success: false, error: String(error) }
  }
}

export async function sendPasswordChangeNotification({ to }: { to: string }) {
  if (!resend) return { success: false, error: 'Email service not configured' }

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: 'A sua password AKMLEVA foi alterada',
      html: emailTemplate({
        title: 'Password alterada',
        subtitle: 'Segurança da Conta',
        body: 'A sua password foi alterada com sucesso. Se não fez esta alteração, contacte o nosso suporte imediatamente.',
      }),
    })
    return { success: true }
  } catch (error) {
    console.error('[email] Failed to send password change notification:', error)
    return { success: false, error: String(error) }
  }
}
