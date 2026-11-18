import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import ItineraryDay from '../components/ItineraryDay';
import BudgetPlanner from '../components/BudgetPlanner';
import MapContainer from '../components/MapContainer';
import Button from '../components/ui/Button';
import { CardSkeletonGrid } from '../components/ui/LoadingSkeleton';
import { recalculateItinerary } from '../utils/itinerary';

const TABS = ['Itinerary', 'Map', 'Budget'];

export default function ItineraryView() {
  const { tripId, itineraryId } = useParams();
  const { showToast } = useToast();

  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [places, setPlaces] = useState([]);
  const [tab, setTab] = useState('Itinerary');
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [changes, setChanges] = useState(null);

  useEffect(() => {
    async function load() {
      const [tripRes, itineraryRes] = await Promise.all([
        api.get(`/trips/${tripId}`),
        api.get(`/itineraries/${itineraryId}`),
      ]);
      setTrip(tripRes.data);
      setItinerary(itineraryRes.data);
      const placesRes = await api.get(`/destinations/${tripRes.data.destinationId}/places`);
      setPlaces(placesRes.data);
      setLoading(false);
    }
    load().catch(() => setLoading(false));
  }, [tripId, itineraryId]);

  async function handleUpdateDayActivities(dayIndex, newActivities) {
    const updatedDays = itinerary.days.map((d, i) => (i === dayIndex ? { ...d, activities: newActivities } : d));
    const { days, totalCost, overBudget: nowOverBudget } = recalculateItinerary(updatedDays, trip.budget);
    setItinerary((prev) => ({ ...prev, days, totalCost, overBudget: nowOverBudget }));
    try {
      await api.put(`/itineraries/${itineraryId}`, { days, totalCost, overBudget: nowOverBudget });
    } catch {
      showToast('Could not save your change. Please try again.', 'error');
    }
  }

  async function handleSaveActualSpending(actualSpending) {
    setTrip((prev) => ({ ...prev, actualSpending }));
    try {
      await api.put(`/trips/${tripId}`, { actualSpending });
    } catch {
      showToast('Could not save your spending. Please try again.', 'error');
    }
  }

  async function handleOptimize() {
    setOptimizing(true);
    try {
      const res = await api.post(`/itineraries/${itineraryId}/optimize`, {
        interests: trip.interests,
        groupType: trip.groupType,
        hotel: trip.hotel,
      });
      setItinerary(res.data);
      setChanges(res.data.changes);
      showToast('Itinerary optimized to fit your budget.', 'success');
    } catch {
      showToast('Could not optimize itinerary.', 'error');
    } finally {
      setOptimizing(false);
    }
  }

  if (loading) return <div className="mx-auto max-w-5xl px-4 py-12"><CardSkeletonGrid count={3} /></div>;
  if (!itinerary || !trip) return null;

  const overBudget = trip.budget && itinerary.totalCost > trip.budget;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link to={`/trips/${tripId}`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink">
        <ArrowLeft size={15} /> Back to Trip
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-ink">Your {trip.numDays}-Day Itinerary</h1>
        {overBudget && (
          <Button onClick={handleOptimize} disabled={optimizing} variant="danger">
            {optimizing ? 'Optimizing...' : 'Optimize Budget'}
          </Button>
        )}
      </div>

      {overBudget && (
        <p className="mt-2 text-sm font-medium text-danger">
          Your current itinerary exceeds your budget by ₹{itinerary.totalCost - trip.budget}.
        </p>
      )}

      {changes && changes.length > 0 && (
        <div className="mt-4 rounded-xl bg-bg-soft p-4 text-sm">
          <p className="mb-2 font-semibold text-ink">What changed:</p>
          <ul className="space-y-1 text-muted">
            {changes.map((c, i) => (
              <li key={i}>
                {c.added
                  ? <>Day {c.day}: Replaced <strong className="text-ink">{c.removed}</strong> with <strong className="text-ink">{c.added}</strong> (saved ₹{c.saved})</>
                  : <>Day {c.day}: Removed <strong className="text-ink">{c.removed}</strong> (saved ₹{c.saved})</>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${tab === t ? 'bg-primary text-white' : 'bg-bg-soft text-ink/70'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'Itinerary' && (
          <div className="space-y-6">
            <p className="text-xs text-muted">Tap a time to reschedule, the check to mark a place visited, or the × to remove it.</p>
            {itinerary.days.map((day, i) => (
              <ItineraryDay
                key={day.day}
                day={day}
                editable
                onUpdateActivities={(activities) => handleUpdateDayActivities(i, activities)}
              />
            ))}
          </div>
        )}
        {tab === 'Map' && trip.hotel?.latitude && (
          <MapContainer center={[trip.hotel.latitude, trip.hotel.longitude]} places={places} hotel={trip.hotel} />
        )}
        {tab === 'Budget' && (
          <BudgetPlanner
            trip={trip}
            itinerary={itinerary}
            places={places}
            actualSpending={trip.actualSpending}
            onSaveActualSpending={handleSaveActualSpending}
          />
        )}
      </div>
    </div>
  );
}
