import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '../../../../../lib/prisma';
import sharp from 'sharp';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const THUMBNAIL_SIZE = 128;

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('avatar') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 5MB' },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate full-size image (max 512px wide, JPEG for consistency)
    const fullImage = await sharp(buffer)
      .resize(512, 512, { fit: 'cover', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Generate thumbnail (128px)
    const thumbnail = await sharp(buffer)
      .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    const fullBase64 = `data:image/jpeg;base64,${fullImage.toString('base64')}`;
    const thumbBase64 = `data:image/jpeg;base64,${thumbnail.toString('base64')}`;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        avatar: thumbBase64, // keep thumbnail in legacy field
        avatarThumbnail: thumbBase64,
        avatarUrl: fullBase64,
      },
      select: {
        avatarUrl: true,
      },
    });

    return NextResponse.json({
      avatarUrl: updatedUser.avatarUrl,
    });
  } catch (error) {
    console.error('Avatar upload failed:', error);
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        avatar: null,
        avatarThumbnail: null,
        avatarUrl: null,
      },
    });

    return NextResponse.json({ avatarUrl: null });
  } catch (error) {
    console.error('Avatar delete failed:', error);
    return NextResponse.json(
      { error: 'Failed to delete avatar' },
      { status: 500 },
    );
  }
}
