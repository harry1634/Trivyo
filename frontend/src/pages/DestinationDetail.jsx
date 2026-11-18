import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Calendar, TrendingUp, Wallet, ArrowLeft, ArrowRight, Compass, Hotel, UtensilsCrossed, Coffee, Ticket } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Rating from '../components/ui/Rating';
import Badge from '../components/ui/Badge';
import MapContainer from '../components/MapContainer';
import { CardSkeletonGrid } from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';

const TYPE_TABS = [
  { key: 'attraction', label: 'Attractions', icon: Compass },
  { key: 'hotel', label: 'Hotels', icon: Hotel },
  { key: 'restaurant', label: 'Restaurants', icon: UtensilsCrossed },
  { key: 'cafe', label: 'Cafes', icon: Coffee },
  { key: 'activity', label: 'Activities', icon: Ticket },
];

const FALLBACK_HERO = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600';
const FALLBACK_PLACE = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600';

function placeBadge(place) {
  if (place.rating >= 4.6) return { label: 'Highly Rated', variant: 'warning' };
  if (place.popularityScore >= 90) return { label: 'Trending', variant: 'primary' };
  if (place.estimatedCost === 0) return { label: 'Free', variant: 'success' };
  return null;
}

export default function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [places, setPlaces] = useState([]);
  const [tab, setTab] = useState('attraction');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTab('attraction');
    Promise.all([api.get(`/destinations/${id}`), api.get(`/destinations/${id}/places`)])
      .then(([destRes, placesRes]) => {
        setDestination(destRes.data);
        setPlaces(placesRes.data);
      })
      .catch(() => setDestination(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="mx-auto max-w-[1440px] px-4 py-12"><CardSkeletonGrid count={3} /></div>;
  if (!destination) return <EmptyState title="Destination not found" />;

  const filteredPlaces = places.filter((p) => p.type === tab);
  const countsByType = TYPE_TABS.reduce((acc, t) => {
    acc[t.key] = places.filter((p) => p.type === t.key).length;
    return acc;
  }, {});

  return (
    <div>
      {/* Hero */}
      <div className="relative h-80 w-full overflow-hidden sm:h-[420px]">
        <img
          src={destination.coverImage || FALLBACK_HERO}
          onError={(e) => (e.currentTarget.src = FALLBACK_HERO)}
          alt={destination.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />

        <div className="absolute inset-x-0 top-0 mx-auto max-w-[1440px] px-4 pt-6 sm:px-6">
          <Link to="/destinations" className="inline-flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white">
            <ArrowLeft size={15} /> All destinations
          </Link>
        </div>

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1440px] px-4 pb-7 sm:px-6">
          <p className="flex items-center gap-1.5 text-sm text-white/85"><MapPin size={14} /> {destination.state}, {destination.country}</p>
          <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{destination.name}</h1>
          <p className="mt-3 max-w-xl text-sm text-white/80 sm:text-base">{destination.description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="flex items-center gap-3 rounded-xl bg-bg-soft p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Wallet size={16} /></span>
              <div>
                <p className="text-[11px] text-muted">Avg. budget/day</p>
                <p className="text-sm font-bold text-ink">₹{destination.avgBudgetPerDay}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-bg-soft p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Calendar size={16} /></span>
              <div>
                <p className="text-[11px] text-muted">Best time</p>
                <p className="text-sm font-bold text-ink">{destination.bestTimeToVisit}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-bg-soft p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><TrendingUp size={16} /></span>
              <div>
                <p className="text-[11px] text-muted">Popularity</p>
                <p className="text-sm font-bold text-ink">{destination.popularity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-bg-soft p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Compass size={16} /></span>
              <div>
                <p className="text-[11px] text-muted">Tags</p>
                <p className="line-clamp-1 text-sm font-bold capitalize text-ink">{destination.tags?.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={() => navigate('/trips/new', { state: { destinationId: destination.id } })} size="lg">
            Plan a trip to {destination.name} <ArrowRight size={16} />
          </Button>
        </div>

        <div className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-ink">Places to explore</h2>
          <div className="mb-6 flex flex-wrap gap-2">
            {TYPE_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  tab === t.key ? 'bg-primary text-white' : 'bg-bg-soft text-ink/70 hover:bg-orange-100'
                }`}
              >
                <t.icon size={14} /> {t.label}
                <span className={tab === t.key ? 'text-white/80' : 'text-muted'}>({countsByType[t.key] || 0})</span>
              </button>
            ))}
          </div>

          {filteredPlaces.length === 0 ? (
            <EmptyState title="No places in this category yet" description="Check back soon, or explore another category above." />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPlaces.map((place) => {
                const badge = placeBadge(place);
                return (
                  <div key={place.id} className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5 transition-shadow hover:shadow-md">
                    <div className="relative h-40 w-full overflow-hidden">
                      <img
                        src={place.image || FALLBACK_PLACE}
                        onError={(e) => (e.currentTarget.src = FALLBACK_PLACE)}
                        alt={place.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {badge && <Badge variant={badge.variant} className="absolute left-3 top-3">{badge.label}</Badge>}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-ink">{place.name}</h3>
                      <p className="text-xs capitalize text-muted">{place.category}</p>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <Rating value={place.rating} reviewCount={place.reviewCount} />
                        <span className="font-semibold text-ink">{place.estimatedCost > 0 ? `₹${place.estimatedCost}` : 'Free'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-ink">Explore on the map</h2>
          <MapContainer center={[destination.latitude, destination.longitude]} places={places} />
        </div>
      </div>
    </div>
  );
}
