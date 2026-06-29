import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api/handler';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const GET = apiHandler(async (req: Request) => {
  const url = new URL(req.url);
  const q = url.searchParams.get('q')?.trim();
  const budget = Number(url.searchParams.get('budget')) || 2000;
  const checkIn = url.searchParams.get('checkIn') || '';
  const checkOut = url.searchParams.get('checkOut') || '';
  const lang = url.searchParams.get('lang') || 'pt';

  if (!q) {
    return NextResponse.json({ ok: false, error: 'Missing query parameter: q' }, { status: 400 });
  }

  const row = await prisma.wvDestination.findFirst({
    where: {
      nome: { contains: q, mode: 'insensitive' },
      lang,
    },
    orderBy: { hotelCount: 'desc' },
  });

  if (!row) {
    return NextResponse.json({ ok: false, error: 'Destino não encontrado' }, { status: 404 });
  }

  const hotels = await prisma.wvHotel.findMany({
    where: { destinoId: row.id },
    orderBy: { precoPorNoite: 'asc' },
    take: 5,
    select: { nome: true, estrelas: true, precoPorNoite: true, tipoAlojamento: true },
  });

  const veja: string[] = Array.isArray(row.veja) ? (row.veja as string[]) : [];
  const faca: string[] = Array.isArray(row.faca) ? (row.faca as string[]) : [];
  const coma: string[] = Array.isArray(row.coma) ? (row.coma as string[]) : [];

  const morning = veja.length > 0 ? veja.slice(0, 2) : [`Explorar ${row.nome}`, 'Visitar pontos turísticos'];
  const afternoon = faca.length > 0 ? faca.slice(0, 2) : ['Passeio cultural', 'Compras e lazer'];
  const evening = coma.length > 0 ? coma.slice(0, 2) : ['Jantar típico', 'Vida noturna'];

  const avgHotelPrice = hotels.length > 0
    ? Math.round(hotels.reduce((sum, h) => sum + Number(h.precoPorNoite), 0) / hotels.length)
    : 80;

  const dailyCost = avgHotelPrice + 60;

  return NextResponse.json({
    ok: true,
    destination: {
      nome: row.nome,
      pais: row.pais,
      paisCode: row.paisCode,
      continente: row.continente,
      tipo: row.tipo,
      descricao: row.descricao,
      imagemUrl: row.imagemUrl,
      slug: `${lang}-${row.id}`,
      iata: row.iata,
    },
    day1: {
      title: `Dia 1: Chegada a ${row.nome}`,
      activities: [
        { period: 'Manhã', emoji: '🗺️', items: morning },
        { period: 'Tarde', emoji: '🏛️', items: afternoon },
        { period: 'Noite', emoji: '🌅', items: evening },
      ],
      meal: coma.length > 0 ? coma[0] : 'Restaurante local recomendado',
      estimatedDailyCost: dailyCost,
      estimatedAccommodation: avgHotelPrice,
    },
    stats: {
      totalHotels: row.hotelCount || hotels.length,
      cheapestHotel: hotels.length > 0 ? Number(hotels[0].precoPorNoite) : null,
    },
    totalDays: 5,
  });
});
