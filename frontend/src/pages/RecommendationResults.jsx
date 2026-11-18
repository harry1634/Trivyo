import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import PlaceCard from '../components/PlaceCard';
import Button from '../components/ui/Button';
import { CardSkeletonGrid } from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';

export default function RecommendationResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [trip, setTrip] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const tripRes = await api.get(`/trips/${id}`);
      setTrip(tripRes.data);

      const recRes = await api.post('/recommendations', {
        destinationId: tripRes.data.destinationId,
        interests: tripRes.data.interests,
        groupType: tripRes.data.groupType,
        hotel: tripRes.data.hotel,
        budget: tripRes.data.budget,
        travelers: tripRes.data.travelers,
        numDays: tripRes.data.numDays,
      });
      setResults(recRes.data);
      setLoading(false);
    }
    load().catch(() => setLoading(false));
  }, [id]);

  async function handleGenerateItinerary() {
    setGenerating(true);
    try {
      const res = await api.post('/itineraries/generate', {
        tripId: trip.id,
        destinationId: trip.destinationId,
        numDays: trip.numDays,
        travelers: trip.travelers,
        hotel: trip.hotel,
        interests: trip.interests,
        groupType: trip.groupType,
        budget: trip.budget,
      });
      await api.put(`/trips/${trip.id}`, { itineraryId: res.data.id, status: 'planned' });
      showToast('Your itinerary is ready!', 'success');
      navigate(`/trips/${trip.id}/itinerary/${res.data.id}`);
    } catch {
      showToast('Could not generate itinerary. Please try again.', 'error');
    } finally {
      setGenerating(false);
    }
  }

  if (loading) return <div className="mx-auto max-w-[1440px] px-4 py-12"><CardSkeletonGrid count={6} /></div>;

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6">
      <Link to={`/trips/${id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink">
        <ArrowLeft size={15} /> Back to Trip
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Your Personalized Recommendations</h1>
          <p className="mt-1 text-muted">Ranked by match, distance from your stay, and budget fit.</p>
        </div>
        <Button onClick={handleGenerateItinerary} disabled={generating}>
          {generating ? 'Generating...' : 'Generate Itinerary'}
        </Button>
      </div>

      {results.length === 0 ? (
        <div className="mt-8"><EmptyState title="No recommendations yet" description="Try adjusting your trip's budget or interests." /></div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((r) => (
            <PlaceCard key={r.place.id} result={r} />
          ))}
        </div>
      )}
    </div>
  );
}
