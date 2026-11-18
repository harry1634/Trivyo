import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, X } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import EmptyState from '../components/ui/EmptyState';
import { CardSkeletonGrid } from '../components/ui/LoadingSkeleton';
import Card from '../components/ui/Card';
import PlaceCard from '../components/PlaceCard';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';

export default function Favorites() {
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState([]);
  const [places, setPlaces] = useState({});
  const [destinations, setDestinations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const favRes = await api.get('/favorites');
      setFavorites(favRes.data);

      const placeFavorites = favRes.data.filter((f) => f.placeId);
      const placeResults = await Promise.all(
        placeFavorites.map((f) => api.get(`/places/${f.placeId}`).then((r) => r.data).catch(() => null))
      );
      const placeMap = {};
      placeFavorites.forEach((f, i) => { if (placeResults[i]) placeMap[f.placeId] = placeResults[i]; });
      setPlaces(placeMap);

      const destRes = await api.get('/destinations');
      setDestinations(Object.fromEntries(destRes.data.map((d) => [d.id, d])));

      setLoading(false);
    }
    load().catch(() => setLoading(false));
  }, []);

  async function handleRemovePlace(place) {
    const favorite = favorites.find((f) => f.placeId === place.id);
    if (!favorite) return;
    await api.delete(`/favorites/${favorite.id}`);
    setFavorites((prev) => prev.filter((f) => f.id !== favorite.id));
    showToast('Removed from favorites', 'info');
  }

  async function handleRemoveDestination(favoriteId) {
    await api.delete(`/favorites/${favoriteId}`);
    setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
    showToast('Removed from favorites', 'info');
  }

  if (loading) return <div className="mx-auto max-w-[1440px] px-4 py-12"><CardSkeletonGrid count={3} /></div>;

  const validPlaceFavorites = favorites.filter((f) => f.placeId && places[f.placeId]);
  const destinationFavorites = favorites.filter((f) => f.destinationId && destinations[f.destinationId]);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-ink">Your Favorites</h1>
      <p className="mt-1 text-muted">Places and destinations you've saved for later.</p>

      {validPlaceFavorites.length === 0 && destinationFavorites.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={Heart} title="No favorites yet" description="Tap the heart icon on any place, or save a trip's destination, to see it here." />
        </div>
      ) : (
        <>
          {destinationFavorites.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-lg font-semibold text-ink">Saved destinations</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {destinationFavorites.map((f) => {
                  const destination = destinations[f.destinationId];
                  return (
                    <Link key={f.id} to={`/destinations/${destination.id}`}>
                      <Card hoverable className="overflow-hidden">
                        <div className="relative h-40 w-full overflow-hidden">
                          <img
                            src={destination.coverImage || FALLBACK_IMAGE}
                            onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                            alt={destination.name}
                            className="h-full w-full object-cover"
                          />
                          <button
                            onClick={(e) => { e.preventDefault(); handleRemoveDestination(f.id); }}
                            className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 shadow"
                            aria-label="Remove from favorites"
                          >
                            <X size={16} className="text-ink" />
                          </button>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-1 text-xs text-muted">
                            <MapPin size={12} /> {destination.state}, {destination.country}
                          </div>
                          <h3 className="mt-1 text-lg font-semibold text-ink">{destination.name}</h3>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {validPlaceFavorites.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 text-lg font-semibold text-ink">Saved places</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {validPlaceFavorites.map((f) => (
                  <PlaceCard
                    key={f.id}
                    result={{ place: places[f.placeId] }}
                    onToggleFavorite={handleRemovePlace}
                    isFavorite
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
