import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.warn('[email] RESEND_API_KEY is not set. Emails will not be sent.');
}

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const EMAIL_FROM = process.env.EMAIL_FROM || 'AKMLEVA <no-reply@akmleva.com>';

/**
 * Send an email verification link to the user.
 */
export async function sendVerificationEmail({
  to,
  token,
  baseUrl,
}: {
  to: string;
  token: string;
  baseUrl: string;
}) {
  if (!resend) {
    console.warn('[email] Resend not configured. Skipping verification email.');
    return { success: false, error: 'Email service not configured' };
  }

  const verifyUrl = `${baseUrl}/auth/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: 'Verify your AKMLEVA email address',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <div style="max-width:480px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background:linear-gradient(135deg,#0d9488,#f97316);padding:32px 24px;text-align:center;">
              <h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:700;">AKMLEVA</h1>
              <p style="color:rgba(255,255,255,0.9);font-size:14px;margin:8px 0 0;">Email Verification</p>
            </div>
            <!-- Body -->
            <div style="padding:32px 24px;">
              <h2 style="font-size:18px;color:#18181b;margin:0 0 16px;">Verify your email address</h2>
              <p style="font-size:14px;color:#52525b;line-height:1.6;margin:0 0 24px;">
                Thank you for signing up for AKMLEVA. Please click the button below to verify your email address and activate your account.
              </p>
              <div style="text-align:center;margin:0 0 24px;">
                <a href="${verifyUrl}"
                   style="display:inline-block;background:#0d9488;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:600;">
                  Verify Email Address
                </a>
              </div>
              <p style="font-size:13px;color:#a1a1aa;line-height:1.5;margin:0 0 16px;">
                This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
              </p>
              <p style="font-size:13px;color:#a1a1aa;line-height:1.5;margin:0;">
                If the button doesn't work, copy and paste this URL into your browser:<br>
                <a href="${verifyUrl}" style="color:#0d9488;word-break:break-all;">${verifyUrl}</a>
              </p>
            </div>
            <!-- Footer -->
            <div style="padding:16px 24px;background:#fafafa;border-top:1px solid #e4e4e7;">
              <p style="font-size:12px;color:#a1a1aa;margin:0;text-align:center;">
                © ${new Date().getFullYear()} AKMLEVA. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('[email] Failed to send verification email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
  }
}

/**
 * Send a password change notification email.
 */
export async function sendPasswordResetEmail({
  to,
  token,
  baseUrl,
}: {
  to: string;
  token: string;
  baseUrl: string;
}) {
  if (!resend) {
    console.warn('[email] Resend not configured. Skipping password reset email.');
    return { success: false, error: 'Email service not configured' };
  }

  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: 'Reset your AKMLEVA password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <div style="max-width:480px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
            <div style="background:linear-gradient(135deg,#0d9488,#f97316);padding:32px 24px;text-align:center;">
              <h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:700;">AKMLEVA</h1>
              <p style="color:rgba(255,255,255,0.9);font-size:14px;margin:8px 0 0;">Password Reset</p>
            </div>
            <div style="padding:32px 24px;">
              <h2 style="font-size:18px;color:#18181b;margin:0 0 16px;">Reset your password</h2>
              <p style="font-size:14px;color:#52525b;line-height:1.6;margin:0 0 24px;">
                We received a request to reset your password. Click the button below to choose a new password. This link will expire in 1 hour.
              </p>
              <div style="text-align:center;margin:0 0 24px;">
                <a href="${resetUrl}"
                   style="display:inline-block;background:#0d9488;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:600;">
                  Reset Password
                </a>
              </div>
              <p style="font-size:13px;color:#a1a1aa;line-height:1.5;margin:0 0 16px;">
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
              <p style="font-size:13px;color:#a1a1aa;line-height:1.5;margin:0;">
                If the button doesn't work, copy and paste this URL into your browser:<br>
                <a href="${resetUrl}" style="color:#0d9488;word-break:break-all;">${resetUrl}</a>
              </p>
            </div>
            <div style="padding:16px 24px;background:#fafafa;border-top:1px solid #e4e4e7;">
              <p style="font-size:12px;color:#a1a1aa;margin:0;text-align:center;">
                © ${new Date().getFullYear()} AKMLEVA. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('[email] Failed to send password reset email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
  }
}

export async function sendPasswordChangeNotification({
  to,
  baseUrl,
}: {
  to: string;
  baseUrl: string;
}) {
  if (!resend) return { success: false, error: 'Email service not configured' };

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: 'Your AKMLEVA password was changed',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
            <div style="background:linear-gradient(135deg,#0d9488,#f97316);padding:24px;text-align:center;">
              <h1 style="color:#fff;font-size:20px;margin:0;">AKMLEVA</h1>
            </div>
            <div style="padding:32px 24px;">
              <h2 style="font-size:18px;color:#18181b;margin:0 0 16px;">Password Changed</h2>
              <p style="font-size:14px;color:#52525b;line-height:1.6;margin:0 0 16px;">
                Your password was successfully changed. If you did not make this change, please contact our support team immediately.
              </p>
              <p style="font-size:13px;color:#a1a1aa;margin:0;">
                <a href="${baseUrl}/auth" style="color:#0d9488;">Log in to your account</a>
              </p>
            </div>
            <div style="padding:16px 24px;background:#fafafa;border-top:1px solid #e4e4e7;">
              <p style="font-size:12px;color:#a1a1aa;margin:0;text-align:center;">
                © ${new Date().getFullYear()} AKMLEVA. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('[email] Failed to send password change notification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
  }
}
