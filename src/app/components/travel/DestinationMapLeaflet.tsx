'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

import type { DestinationMapMarker } from '../../../lib/travel/destination-map';
import 'leaflet/dist/leaflet.css';

// Fix default marker assets when bundled by Next.js
const iconBase = 'https://unpkg.com/leaflet@1.9.4/dist/images';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: `${iconBase}/marker-icon-2x.png`,
  iconUrl: `${iconBase}/marker-icon.png`,
  shadowUrl: `${iconBase}/marker-shadow.png`,
});

const destinationIcon = new L.Icon({
  iconUrl: `${iconBase}/marker-icon.png`,
  iconRetinaUrl: `${iconBase}/marker-icon-2x.png`,
  shadowUrl: `${iconBase}/marker-shadow.png`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const airportIcon = new L.DivIcon({
  className: '',
  html: `<span style="
    display:flex;align-items:center;justify-content:center;
    width:28px;height:28px;border-radius:50%;
    background:#0ea5e9;color:white;font-size:11px;font-weight:700;
    border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.35);
  ">✈</span>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const hotelIcon = new L.DivIcon({
  className: '',
  html: `<span style="
    display:flex;align-items:center;justify-content:center;
    width:22px;height:22px;border-radius:4px;
    background:#ea580c;color:white;font-size:10px;font-weight:700;
    border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.35);
  ">🏨</span>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function markerIcon(kind: DestinationMapMarker['kind']) {
  if (kind === 'airport') return airportIcon;
  if (kind === 'hotel') return hotelIcon;
  return destinationIcon;
}

function FitBounds({
  markers,
  compact,
}: {
  markers: DestinationMapMarker[];
  compact?: boolean;
}) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 1) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lon] as [number, number]));
      map.fitBounds(bounds, {
        padding: compact ? [20, 20] : [48, 48],
        maxZoom: compact ? 13 : 12,
      });
    } else if (markers.length === 1) {
      map.setView([markers[0]!.lat, markers[0]!.lon], compact ? 12 : 11);
    }
  }, [map, markers, compact]);
  return null;
}

export type DestinationMapLeafletProps = {
  markers: DestinationMapMarker[];
  destinationLabel: string;
  airportLabel: string;
  hotelLabel?: string;
  /** Cartão de resultados: mapa mais baixo, sem popups. */
  compact?: boolean;
};

export function DestinationMapLeaflet({
  markers,
  destinationLabel,
  airportLabel,
  hotelLabel = 'Hotel',
  compact = false,
}: DestinationMapLeafletProps) {
  const center = markers[0]!;
  const zoom = markers.length > 1 ? 10 : 11;

  const kindLabel = (kind: DestinationMapMarker['kind']) => {
    if (kind === 'airport') return airportLabel;
    if (kind === 'hotel') return hotelLabel;
    return destinationLabel;
  };

  return (
    <MapContainer
      center={[center.lat, center.lon]}
      zoom={zoom}
      scrollWheelZoom={!compact}
      dragging={!compact}
      zoomControl={!compact}
      className="h-full w-full rounded-xl z-0"
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds markers={markers} compact={compact} />
      {markers.map((m) => (
        <Marker
          key={`${m.kind}-${m.lat}-${m.lon}-${m.label}`}
          position={[m.lat, m.lon]}
          icon={markerIcon(m.kind)}
        >
          {!compact && (
            <Popup>
              <span className="text-sm font-medium">
                {kindLabel(m.kind)}: {m.label}
              </span>
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  );
}
