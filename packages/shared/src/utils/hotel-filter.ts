const SHOP_OR_POI_RE =
  /\b(primark|zara|h&m|mediamarkt|supermercado|mercadona|carrefour|decathlon|fnac|ikea|mcdonald|starbucks|caf[eé]|restaurant|restaurante|bar\b|pub\b|plaza|praça|church|igreja|cathedral|museu|museum|monument|castelo|castle|fortaleza|fort\b|playground|parque nacional|national park|mercado|market|shopping|loja|store\b|boutique|galeria|gallery|teatro|theater|theatre|estádio|stadium|universidade|university|escola|school|hospital|farmácia|pharmacy|banco|bank\b|atm\b|posto|gas station|estação|station\b|terminal\b|porto\b|harbour|harbor|beach\b|praia\b|miradouro|viewpoint|torre\b|tower\b|ponte\b|bridge\b|ruínas|ruins|monast[eé]rio|monastery|palácio|palace|sinagoga|synagogue|mesquita|mosque|templo|temple\b|aquário|aquarium|zoo\b|jardim bot|botanical)\b/i;

const ACCOMMODATION_RE =
  /\b(hotel|hostel|pousada|resort|albergar|guesthouse|guest house|motel|inn\b|suites?\b|lodging|alojamento|parador|pens[aã]o|bed and breakfast|b&b|apartamento tur[ií]stico|apart-?hotel|aparthotel|ryokan|pension\b|auberge|herberg|mamba|hospedaria|hostal\b|posada\b|fonda\b|caravan|camping\b|glamping|ref[uú]gio|hut\b|chalet\b|villa hotel|eco-?lodge)\b/i;

const TRUSTED_HOTEL_SOURCES = new Set([
  'liteapi',
  'wikivoyage-en',
  'wikivoyage-sleep',
  'synthetic',
]);

export function isLikelyAccommodationName(nome: string): boolean {
  const n = nome.trim();
  if (n.length < 2) return false;
  if (SHOP_OR_POI_RE.test(n)) return false;
  return ACCOMMODATION_RE.test(n);
}

export function isAccommodationHotel(hotel: {
  nome: string;
  fonte?: string | null;
}): boolean {
  const fonte = hotel.fonte?.trim().toLowerCase() ?? '';
  if (fonte === 'rejected_geo') return false;

  if (TRUSTED_HOTEL_SOURCES.has(fonte)) {
    return !SHOP_OR_POI_RE.test(hotel.nome);
  }

  if (fonte === 'wikivoyage' || fonte === 'wikivoyage-listing' || !fonte) {
    return isLikelyAccommodationName(hotel.nome);
  }

  return isLikelyAccommodationName(hotel.nome);
}

export function pickBestAccommodationHotel<T extends { nome: string; fonte?: string | null; preco_por_noite?: number; precoPorNoite?: number }>(
  hotels: T[],
): T | null {
  const valid = hotels.filter(isAccommodationHotel);
  if (!valid.length) return null;
  return [...valid].sort(
    (a, b) =>
      (a.preco_por_noite ?? a.precoPorNoite ?? 0) - (b.preco_por_noite ?? b.precoPorNoite ?? 0),
  )[0]!;
}
