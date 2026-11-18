import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Calendar, Users, Wallet, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { CardSkeletonGrid } from '../components/ui/LoadingSkeleton';
import TripActionsMenu from '../components/TripActionsMenu';

const STATUS_VARIANT = {
  planning: 'warning',
  planned: 'primary',
  completed: 'success',
  canceled: 'danger',
};

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Done' },
  { key: 'canceled', label: 'Canceled' },
];

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';

export default function Trips() {
  const { showToast } = useToast();
  const [trips, setTrips] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [destinations, setDestinations] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    Promise.all([api.get('/trips'), api.get('/destinations'), api.get('/favorites')])
      .then(([tripsRes, destRes, favRes]) => {
        setTrips(tripsRes.data);
        setDestinations(Object.fromEntries(destRes.data.map((d) => [d.id, d])));
        setFavorites(favRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const favoritedDestinationIds = new Set(favorites.filter((f) => f.destinationId).map((f) => f.destinationId));

  const filteredTrips = trips.filter((trip) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return trip.status !== 'completed' && trip.status !== 'canceled';
    return trip.status === filter;
  });

  async function handleSetStatus(trip, status, successMessage) {
    try {
      await api.put(`/trips/${trip.id}`, { status });
      setTrips((prev) => prev.map((t) => (t.id === trip.id ? { ...t, status } : t)));
      showToast(successMessage, 'success');
    } catch {
      showToast('Could not update trip. Please try again.', 'error');
    }
  }

  async function handleSaveForLater(trip) {
    const destinationId = trip.destinationId;
    if (!destinationId || favoritedDestinationIds.has(destinationId)) return;
    try {
      const { data } = await api.post('/favorites', { destinationId });
      setFavorites((prev) => [...prev, data]);
      showToast('Destination saved to favorites.', 'success');
    } catch {
      showToast('Could not save destination. Please try again.', 'error');
    }
  }

  async function handleDeleteTrip(trip) {
    const destination = destinations[trip.destinationId];
    if (!window.confirm(`Delete your trip to ${destination?.name || trip.destinationId}? This can't be undone.`)) return;
    try {
      await api.delete(`/trips/${trip.id}`);
      setTrips((prev) => prev.filter((t) => t.id !== trip.id));
      showToast('Trip deleted.', 'success');
    } catch {
      showToast('Could not delete trip. Please try again.', 'error');
    }
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">My Trips</h1>
          <p className="mt-1 text-muted">Everything you're planning, in one place.</p>
        </div>
        <Button as={Link} to="/trips/new">Plan a new trip</Button>
      </div>

      {!loading && trips.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === f.key ? 'bg-primary text-white' : 'bg-white text-muted ring-1 ring-ink/10 hover:text-ink'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8">
        {loading ? (
          <CardSkeletonGrid count={3} />
        ) : trips.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="No trips yet"
            description="Start planning your first trip with Trivyo — pick a destination, set your budget, and we'll do the rest."
            action={<Button as={Link} to="/trips/new">Plan My Trip</Button>}
          />
        ) : filteredTrips.length === 0 ? (
          <EmptyState icon={Compass} title="No trips here" description="Nothing matches this filter yet." />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTrips.map((trip) => {
              const destination = destinations[trip.destinationId];
              return (
                <div
                  key={trip.id}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5 transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link to={`/trips/${trip.id}`} className="block">
                    <div className="relative h-36 w-full overflow-hidden">
                      <img
                        src={destination?.coverImage || FALLBACK_IMAGE}
                        onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                        alt={destination?.name || trip.destinationId}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <Badge variant={STATUS_VARIANT[trip.status] || 'neutral'} className="absolute left-3 top-3 capitalize">
                        {trip.status}
                      </Badge>
                      <h3 className="absolute bottom-3 left-4 right-14 truncate text-lg font-bold text-white">
                        {destination?.name || trip.destinationId}
                      </h3>
                    </div>

                    <div className="p-5">
                      <div className="space-y-1.5 text-sm text-muted">
                        <p className="flex items-center gap-1.5"><Calendar size={13} /> {trip.startDate} – {trip.endDate}</p>
                        <p className="flex items-center gap-1.5"><Users size={13} /> {trip.travelers} traveler{trip.travelers > 1 ? 's' : ''} · {trip.numDays} days</p>
                        <p className="flex items-center gap-1.5"><Wallet size={13} /> ₹{trip.budget.toLocaleString()} budget</p>
                      </div>

                      <p className="mt-4 flex items-center gap-1 text-sm font-medium text-primary-dark">
                        View trip <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                      </p>
                    </div>
                  </Link>

                  <div className="absolute right-3 top-3">
                    <TripActionsMenu
                      trip={trip}
                      isFavorited={favoritedDestinationIds.has(trip.destinationId)}
                      onMarkDone={() => handleSetStatus(trip, 'completed', 'Trip marked as done.')}
                      onCancel={() => handleSetStatus(trip, 'canceled', 'Trip canceled.')}
                      onSaveForLater={() => handleSaveForLater(trip)}
                      onDelete={() => handleDeleteTrip(trip)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
