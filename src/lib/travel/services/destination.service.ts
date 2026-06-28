import { SearchDestinationsSchema, type SearchDestinationsInput } from '../schemas/destination.schema';
import * as destinationRepo from '../repositories/destination.repository';
import { toDestinationDTOFromRow } from '../dto/destination.dto';

export async function searchDestinations(input: unknown) {
  const validated = SearchDestinationsSchema.parse(input);
  return await searchDestinationsFromDb(validated);
}

async function searchDestinationsFromDb(opts: SearchDestinationsInput) {
  const { items, total } = await destinationRepo.searchDestinations(opts);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemsTyped = items as any[];
  const destIds = itemsTyped.map((r) => r.id as number);
  const hotelStatsMap = await destinationRepo.getHotelStatsForDestinations(destIds);

  return {
    total,
    source: 'db' as const,
    items: itemsTyped.map((r) => {
      const stats = hotelStatsMap.get(r.id);
      return toDestinationDTOFromRow(r, {
        avgStars: stats?.avgStars ?? null,
        hotelTypes: stats?.hotelTypes ?? null,
      });
    }),
  };
}
