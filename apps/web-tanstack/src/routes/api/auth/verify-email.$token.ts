import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '@akmleva/db'

export const Route = createFileRoute('/api/auth/verify-email/$token')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { token } = params

        if (!token || typeof token !== 'string') {
          return new Response(null, {
            status: 302,
            headers: { Location: '/auth/verify-email?status=invalid' },
          })
        }

        const verificationToken = await prisma.emailVerificationToken.findUnique({
          where: { token },
          select: {
            tokenId: true,
            userId: true,
            email: true,
            expiresAt: true,
          },
        })

        if (!verificationToken) {
          return new Response(null, {
            status: 302,
            headers: { Location: '/auth/verify-email?status=invalid' },
          })
        }

        if (new Date() > verificationToken.expiresAt) {
          await prisma.emailVerificationToken.delete({
            where: { tokenId: verificationToken.tokenId },
          })

          return new Response(null, {
            status: 302,
            headers: { Location: '/auth/verify-email?status=expired' },
          })
        }

        await prisma.$transaction([
          prisma.user.update({
            where: { id: verificationToken.userId },
            data: {
              emailVerified: true,
              emailVerifiedAt: new Date(),
            },
          }),
          prisma.emailVerificationToken.delete({
            where: { tokenId: verificationToken.tokenId },
          }),
        ])

        return new Response(null, {
          status: 302,
          headers: { Location: '/auth/verify-email?status=success' },
        })
      },
    },
  },
})
