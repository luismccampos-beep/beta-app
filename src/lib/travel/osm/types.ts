/** Normalized hotel POI from OSM ecosystem (BizData / Photon / DB). */
export type OsmHotelPlace = {
  name: string;
  lat: number;
  lon: number;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
  opening_hours?: string;
  category?: string;
  osm_id?: string | number;
  osm_type?: string;
  wikidata_id?: string;
  image_url?: string;
  source: 'bizdata' | 'photon' | 'db';
};
