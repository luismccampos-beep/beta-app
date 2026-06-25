'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const reviewSchema = z.object({
  destinoId: z.number(),
  authorName: z.string().min(2).max(120),
  authorEmail: z.string().email().optional().or(z.literal('')),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(2000),
});

export async function submitDestinationReview(formData: FormData) {
  const raw = {
    destinoId: Number(formData.get('destinoId')),
    authorName: String(formData.get('authorName') ?? ''),
    authorEmail: String(formData.get('authorEmail') ?? ''),
    rating: Number(formData.get('rating')),
    comment: String(formData.get('comment') ?? ''),
  };

  const parsed = reviewSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: 'Dados inválidos. Verifica os campos.' };
  }

  try {
    await prisma.wvDestinationReview.create({
      data: {
        destinoId: parsed.data.destinoId,
        authorName: parsed.data.authorName,
        authorEmail: parsed.data.authorEmail || null,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
        isApproved: true,
      },
    });
    return { success: true };
  } catch {
    return { error: 'Erro ao enviar review. Tenta novamente.' };
  }
}

export async function getDestinationReviews(destinoId: number) {
  try {
    return await prisma.wvDestinationReview.findMany({
      where: { destinoId, isApproved: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  } catch {
    return [];
  }
}
