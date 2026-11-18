import { useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Badge from './ui/Badge';

// Leaflet's default marker icons reference image paths that Vite doesn't
// resolve automatically, so we rebuild the default icon from CDN URLs.
const DEFAULT_ICON = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const HOTEL_ICON = new L.Icon({
  ...DEFAULT_ICON.options,
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  className: 'hue-rotate-[130deg]',
});

const CATEGORY_FILTERS = [
  { key: 'attraction', label: 'Attractions' },
  { key: 'hotel', label: 'Hotels' },
  { key: 'restaurant', label: 'Restaurants' },
  { key: 'cafe', label: 'Cafes' },
  { key: 'activity', label: 'Activities' },
];

export default function MapContainer({ center, places = [], hotel, height = '480px' }) {
  const [activeFilters, setActiveFilters] = useState(CATEGORY_FILTERS.map((f) => f.key));

  function toggleFilter(key) {
    setActiveFilters((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  const visiblePlaces = places.filter((p) => activeFilters.includes(p.type));

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {CATEGORY_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => toggleFilter(f.key)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeFilters.includes(f.key) ? 'bg-primary text-white' : 'bg-bg-soft text-muted'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ height }} className="overflow-hidden rounded-2xl ring-1 ring-ink/10">
        <LeafletMap center={center} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {hotel && (
            <Marker position={[hotel.latitude, hotel.longitude]} icon={HOTEL_ICON}>
              <Popup>
                <strong>{hotel.name}</strong> (your stay)
              </Popup>
            </Marker>
          )}

          {visiblePlaces.map((place) => (
            <Marker key={place.id} position={[place.latitude, place.longitude]} icon={DEFAULT_ICON}>
              <Popup>
                <div className="min-w-[160px]">
                  <strong>{place.name}</strong>
                  <div className="mt-1 text-xs capitalize text-gray-500">{place.category}</div>
                  <div className="mt-1 text-xs">⭐ {place.rating} · {place.estimatedCost > 0 ? `₹${place.estimatedCost}` : 'Free'}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </LeafletMap>
      </div>
    </div>
  );
}
