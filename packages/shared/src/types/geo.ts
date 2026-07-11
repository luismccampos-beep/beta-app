export type LatLon = {
  lat: number;
  lon: number;
};

export type RoadDistanceResult = {
  distanceKm: number;
  durationMinutes: number;
};

export type DestinationMapMarker = {
  id: number;
  nome: string;
  lat: number;
  lon: number;
  tipo: string;
  imagem_url: string;
};

export type HotelMapPoint = {
  id: number;
  nome: string;
  lat: number;
  lon: number;
  estrelas: number;
  preco_por_noite: number;
};

export type DestinationMapInput = {
  destination: DestinationMapMarker;
  hotels: HotelMapPoint[];
};
