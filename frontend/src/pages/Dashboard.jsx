import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Calendar, Wallet, Heart, XCircle, MapPinned, ArrowRight, Plus, Sparkles } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { CardSkeletonGrid } from '../components/ui/LoadingSkeleton';
import TripActionsMenu from '../components/TripActionsMenu';

const STATUS_VARIANT = { planning: 'warning', planned: 'primary', completed: 'success', canceled: 'danger' };
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function daysUntil(dateStr) {
  const diff = Math.ceil((new Date(dateStr) - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24));
  if (diff < 0) return null;
  if (diff === 0) return 'Starts today';
  if (diff === 1) return 'Starts tomorrow';
  return `In ${diff} days`;
}

function TripCard({ trip, destination, dimmed = false, isFavorited, onMarkDone, onCancel, onSaveForLater, onDelete }) {
  return (
    <div
      className={`group flex items-center gap-4 overflow-hidden rounded-2xl bg-white p-3 shadow-sm ring-1 ring-ink/5 transition-all hover:-translate-y-0.5 hover:shadow-lg ${dimmed ? 'opacity-75' : ''}`}
    >
      <Link to={`/trips/${trip.id}`} className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
        <img
          src={destination?.coverImage || FALLBACK_IMAGE}
          onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
          alt={destination?.name || trip.destinationId}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <Link to={`/trips/${trip.id}`} className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <h3 className="truncate text-base font-bold uppercase text-ink">{destination?.name || trip.destinationId}</h3>
          {trip.status === 'canceled' && <Badge variant="danger" className="w-fit">Canceled</Badge>}
        </div>
        <p className="mt-0.5 text-xs text-muted">{trip.startDate} – {trip.endDate}</p>
        <p className="mt-0.5 text-xs font-medium text-ink/70">₹{trip.budget.toLocaleString()} · {trip.numDays} days</p>
      </Link>
      <TripActionsMenu
        trip={trip}
        isFavorited={isFavorited}
        onMarkDone={onMarkDone}
        onCancel={onCancel}
        onSaveForLater={onSaveForLater}
        onDelete={onDelete}
      />
    </div>
  );
}

export default function Dashboard() {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const [trips, setTrips] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [destinations, setDestinations] = useState({});
  const [loading, setLoading] = useState(true);

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

  const upcoming = trips
    .filter((t) => t.status !== 'completed' && t.status !== 'canceled')
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  const past = trips.filter((t) => t.status === 'completed');
  const canceled = trips.filter((t) => t.status === 'canceled');
  const [featured, ...rest] = upcoming;
  const featuredDestination = featured ? destinations[featured.destinationId] : null;

  const totalBudgetPlanned = upcoming.reduce((sum, t) => sum + (t.budget || 0), 0);

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
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl">
        <img src="/hero-beach.png" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-bg/30" />
        <div className="relative px-6 py-10 sm:px-10 sm:py-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary-dark">
            <Sparkles size={12} /> Welcome back!
          </span>
          <h1 className="mt-2 text-3xl font-bold text-[#172033]">{greeting()}, {profile?.name?.split(' ')[0] || 'traveler'} 👋</h1>
          <p className="mt-1 text-muted">Ready for your next adventure?</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button as={Link} to="/trips/new">
              Plan a new trip <Plus size={16} />
            </Button>
            <Button as={Link} to="/destinations" variant="outline" className="border-[#E7E5E4] bg-white/80 backdrop-blur-sm">
              Explore destinations
            </Button>
          </div>
        </div>
      </div>

      {!loading && trips.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Compass, value: upcoming.length, label: 'Upcoming trips', detail: 'You have trips planned' },
            { icon: Wallet, value: `₹${totalBudgetPlanned.toLocaleString()}`, label: 'Budget planned', detail: 'Across all upcoming trips' },
            { icon: Heart, value: favorites.length, label: 'Wishlist', detail: 'Places & destinations you love', to: '/favorites' },
            { icon: XCircle, value: canceled.length, label: 'Canceled trips', detail: 'Trips you called off', to: canceled.length > 0 ? '/trips' : undefined },
          ].map((stat) => (
            <Link key={stat.label} to={stat.to || '#'} onClick={(e) => !stat.to && e.preventDefault()} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-ink/5 transition-shadow hover:shadow-md">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <stat.icon size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-xl font-bold leading-tight text-ink">{stat.value}</p>
                <p className="text-xs font-medium text-ink/70">{stat.label}</p>
                <p className="truncate text-xs text-muted">{stat.detail}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {loading ? (
        <div className="mt-10"><CardSkeletonGrid count={3} /></div>
      ) : trips.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={Compass} title="No trips yet" description="Start planning your first trip with Trivyo." action={<Button as={Link} to="/trips/new">Plan My Trip</Button>} />
        </div>
      ) : (
        <>
          {featured && (
            <div className="mt-10">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ink">Up next</h2>
                <Link to="/trips" className="flex items-center gap-1 text-sm font-medium text-primary-dark">
                  View all trips <ArrowRight size={14} />
                </Link>
              </div>

              <div className="relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5 transition-shadow hover:shadow-lg sm:flex-row">
                <Link to={`/trips/${featured.id}`} className="group relative h-48 w-full shrink-0 overflow-hidden sm:h-auto sm:w-72">
                  <img
                    src={featuredDestination?.coverImage || FALLBACK_IMAGE}
                    onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                    alt={featuredDestination?.name || featured.destinationId}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>

                <div className="flex flex-1 flex-col justify-center p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={STATUS_VARIANT[featured.status] || 'neutral'} className="w-fit capitalize">{featured.status}</Badge>
                    {daysUntil(featured.startDate) && (
                      <Badge variant="neutral" className="w-fit">{daysUntil(featured.startDate)}</Badge>
                    )}
                  </div>
                  <Link to={`/trips/${featured.id}`}>
                    <h3 className="mt-2 text-2xl font-bold uppercase text-ink">{featuredDestination?.name || featured.destinationId}</h3>
                  </Link>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
                    <span className="flex items-center gap-1.5"><Calendar size={13} /> {featured.startDate} – {featured.endDate}</span>
                    <span className="flex items-center gap-1.5"><Wallet size={13} /> ₹{featured.budget.toLocaleString()} budget</span>
                    <span className="flex items-center gap-1.5"><MapPinned size={13} /> {featured.numDays} days</span>
                  </div>
                  {featuredDestination?.description && (
                    <p className="mt-3 max-w-xl text-sm text-muted">{featuredDestination.description}</p>
                  )}
                  <Link to={`/trips/${featured.id}`} className="group mt-4 flex w-fit items-center gap-1 text-sm font-medium text-primary-dark">
                    View Trip <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>

                <div className="absolute right-4 top-4">
                  <TripActionsMenu
                    trip={featured}
                    isFavorited={featuredDestination ? favoritedDestinationIds.has(featured.destinationId) : false}
                    onMarkDone={() => handleSetStatus(featured, 'completed', 'Trip marked as done.')}
                    onCancel={() => handleSetStatus(featured, 'canceled', 'Trip canceled.')}
                    onSaveForLater={() => handleSaveForLater(featured)}
                    onDelete={() => handleDeleteTrip(featured)}
                  />
                </div>
              </div>
            </div>
          )}

          {rest.length > 0 && (
            <div className="mt-10">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ink">Other upcoming trips</h2>
                <Link to="/trips" className="flex items-center gap-1 text-sm font-medium text-primary-dark">
                  View all <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    destination={destinations[trip.destinationId]}
                    isFavorited={favoritedDestinationIds.has(trip.destinationId)}
                    onMarkDone={() => handleSetStatus(trip, 'completed', 'Trip marked as done.')}
                    onCancel={() => handleSetStatus(trip, 'canceled', 'Trip canceled.')}
                    onSaveForLater={() => handleSaveForLater(trip)}
                    onDelete={() => handleDeleteTrip(trip)}
                  />
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 text-lg font-semibold text-ink">Previous trips</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {past.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    destination={destinations[trip.destinationId]}
                    dimmed
                    isFavorited={favoritedDestinationIds.has(trip.destinationId)}
                    onMarkDone={() => handleSetStatus(trip, 'completed', 'Trip marked as done.')}
                    onCancel={() => handleSetStatus(trip, 'canceled', 'Trip canceled.')}
                    onSaveForLater={() => handleSaveForLater(trip)}
                    onDelete={() => handleDeleteTrip(trip)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
