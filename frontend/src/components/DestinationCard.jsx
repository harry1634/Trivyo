import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';

export default function DestinationCard({ destination }) {
  return (
    <Link to={`/destinations/${destination.id}`}>
      <Card hoverable className="overflow-hidden">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={destination.coverImage || FALLBACK_IMAGE}
            onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
            alt={destination.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {destination.popularity >= 90 && (
            <Badge className="absolute left-3 top-3">Popular</Badge>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-1 text-xs text-muted">
            <MapPin size={12} />
            {destination.state}, {destination.country}
          </div>
          <h3 className="mt-1 text-lg font-semibold text-ink">{destination.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{destination.description}</p>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-muted">From <span className="font-semibold text-ink">₹{destination.avgBudgetPerDay}</span>/day</span>
            <span className="font-medium text-primary-dark">{destination.popularity}% loved</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
