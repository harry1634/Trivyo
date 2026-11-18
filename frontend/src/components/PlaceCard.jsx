import { Clock, MapPin, Heart } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Rating from './ui/Rating';
import Button from './ui/Button';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800';

export default function PlaceCard({ result, onAddToItinerary, onViewOnMap, onToggleFavorite, isFavorite }) {
  const { place, matchPercent, distanceKm, badge } = result;

  return (
    <Card hoverable className="overflow-hidden">
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={place.image || FALLBACK_IMAGE}
          onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
          alt={place.name}
          className="h-full w-full object-cover"
        />
        {matchPercent != null && (
          <Badge className="absolute left-3 top-3">{matchPercent}% Match</Badge>
        )}
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(place)}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 shadow"
          >
            <Heart size={16} className={isFavorite ? 'fill-primary text-primary' : 'text-ink'} />
          </button>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-ink">{place.name}</h3>
          {badge && <Badge variant="warning">{badge}</Badge>}
        </div>
        <p className="mt-0.5 text-xs capitalize text-muted">{place.category}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <Rating value={place.rating} />
          {distanceKm != null && (
            <span className="inline-flex items-center gap-1"><MapPin size={12} /> {distanceKm} km away</span>
          )}
          {place.visitDuration > 0 && (
            <span className="inline-flex items-center gap-1"><Clock size={12} /> {Math.round(place.visitDuration / 60) || 1}h</span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold text-ink">{place.estimatedCost > 0 ? `₹${place.estimatedCost}` : 'Free'}</span>
          <div className="flex gap-2">
            {onViewOnMap && (
              <Button variant="outline" size="sm" onClick={() => onViewOnMap(place)}>Map</Button>
            )}
            {onAddToItinerary && (
              <Button size="sm" onClick={() => onAddToItinerary(place)}>Add</Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
