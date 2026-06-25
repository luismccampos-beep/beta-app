import { z } from 'zod';

export const SearchDestinationsSchema = z.object({
  q: z.string().max(100).optional(),
  pais: z.string().max(80).optional(),
  continente: z.string().max(80).optional(),
  lang: z.string().length(2).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(24),
  offset: z.coerce.number().int().min(0).default(0),
  hotelTypes: z.array(z.string()).optional(),
});

export type SearchDestinationsInput = z.infer<typeof SearchDestinationsSchema>;

export const GetDestinationBySlugSchema = z.object({
  slug: z.string().min(3).max(50),
});

export const NearbyHotelsSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radiusKm: z.coerce.number().min(0.5).max(100).default(10),
  minStars: z.coerce.number().int().min(0).max(5).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});
