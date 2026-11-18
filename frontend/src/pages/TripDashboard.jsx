import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import ItineraryDay from '../components/ItineraryDay';
import BudgetPlanner from '../components/BudgetPlanner';
import MapContainer from '../components/MapContainer';
import Button from '../components/ui/Button';
import { CardSkeletonGrid } from '../components/ui/LoadingSkeleton';
import { recalculateItinerary } from '../utils/itinerary';

const TABS = ['Overview', 'Itinerary', 'Map', 'Budget', 'Checklist'];

export default function TripDashboard() {
  const { id } = useParams();
  const { showToast } = useToast();

  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [places, setPlaces] = useState([]);
  const [checklist, setChecklist] = useState(null);
  const [tab, setTab] = useState('Overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const tripRes = await api.get(`/trips/${id}`);
      setTrip(tripRes.data);

      const placesRes = await api.get(`/destinations/${tripRes.data.destinationId}/places`);
      setPlaces(placesRes.data);

      if (tripRes.data.itineraryId) {
        const itineraryRes = await api.get(`/itineraries/${tripRes.data.itineraryId}`);
        setItinerary(itineraryRes.data);
      }

      const checklistRes = await api.get(`/checklists/trip/${id}`);
      setChecklist(checklistRes.data);

      setLoading(false);
    }
    load().catch(() => setLoading(false));
  }, [id]);

  async function handleUpdateDayActivities(dayIndex, newActivities) {
    const updatedDays = itinerary.days.map((d, i) => (i === dayIndex ? { ...d, activities: newActivities } : d));
    const { days, totalCost, overBudget } = recalculateItinerary(updatedDays, trip.budget);
    setItinerary((prev) => ({ ...prev, days, totalCost, overBudget }));
    try {
      await api.put(`/itineraries/${trip.itineraryId}`, { days, totalCost, overBudget });
    } catch {
      showToast('Could not save your change. Please try again.', 'error');
    }
  }

  async function handleSaveActualSpending(actualSpending) {
    setTrip((prev) => ({ ...prev, actualSpending }));
    try {
      await api.put(`/trips/${trip.id}`, { actualSpending });
    } catch {
      showToast('Could not save your spending. Please try again.', 'error');
    }
  }

  async function toggleChecklistItem(category, index) {
    const updated = {
      ...checklist.categories,
      [category]: checklist.categories[category].map((item, i) => (i === index ? { ...item, checked: !item.checked } : item)),
    };
    setChecklist((c) => ({ ...c, categories: updated }));
    await api.put(`/checklists/${checklist.id}`, { categories: updated });
  }

  if (loading || !trip) return <div className="mx-auto max-w-5xl px-4 py-12"><CardSkeletonGrid count={3} /></div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link to="/trips" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink">
        <ArrowLeft size={15} /> My Trips
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{trip.status}</p>
          <h1 className="text-2xl font-bold uppercase text-ink">{trip.destinationId}</h1>
          <p className="mt-1 text-sm text-muted">{trip.startDate} – {trip.endDate} · {trip.travelers} travelers · ₹{trip.budget}</p>
        </div>
        {!trip.itineraryId && (
          <Button as={Link} to={`/trips/${trip.id}/recommendations`}>Generate Itinerary</Button>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
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
        {tab === 'Overview' && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-bg-soft p-4"><p className="text-xs text-muted">Destination</p><p className="font-semibold uppercase text-ink">{trip.destinationId}</p></div>
            <div className="rounded-xl bg-bg-soft p-4"><p className="text-xs text-muted">Duration</p><p className="font-semibold text-ink">{trip.numDays} days</p></div>
            <div className="rounded-xl bg-bg-soft p-4"><p className="text-xs text-muted">Travel style</p><p className="font-semibold text-ink">{trip.travelStyle}</p></div>
            <div className="rounded-xl bg-bg-soft p-4"><p className="text-xs text-muted">Accommodation</p><p className="font-semibold text-ink">{trip.hotel?.name || 'Not set'}</p></div>
          </div>
        )}

        {tab === 'Itinerary' && (
          itinerary ? (
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
          ) : (
            <p className="text-muted">No itinerary generated yet.</p>
          )
        )}

        {tab === 'Map' && trip.hotel?.latitude && (
          <MapContainer center={[trip.hotel.latitude, trip.hotel.longitude]} places={places} hotel={trip.hotel} />
        )}

        {tab === 'Budget' && (
          itinerary ? (
            <BudgetPlanner
              trip={trip}
              itinerary={itinerary}
              places={places}
              actualSpending={trip.actualSpending}
              onSaveActualSpending={handleSaveActualSpending}
            />
          ) : (
            <p className="text-muted">Generate an itinerary first to see a budget breakdown.</p>
          )
        )}

        {tab === 'Checklist' && checklist && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {Object.entries(checklist.categories).map(([category, items]) => (
              <div key={category} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/5">
                <h3 className="mb-3 font-semibold text-ink">{category}</h3>
                <ul className="space-y-2">
                  {items.map((item, i) => (
                    <li key={i}>
                      <button onClick={() => toggleChecklistItem(category, i)} className="flex w-full items-center gap-2 text-left text-sm">
                        <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${item.checked ? 'border-primary bg-primary text-white' : 'border-ink/20'}`}>
                          {item.checked && <Check size={12} />}
                        </span>
                        <span className={item.checked ? 'text-muted line-through' : 'text-ink'}>{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
