import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Card from '../components/ui/Card';

const STEPS = ['Destination', 'Dates', 'Travelers', 'Budget', 'Style', 'Interests', 'Stay', 'Summary'];
const TRAVEL_STYLES = ['Budget', 'Balanced', 'Premium'];
const INTERESTS = ['Beaches', 'Adventure', 'Food', 'History', 'Nature', 'Culture', 'Shopping', 'Photography', 'Nightlife', 'Family', 'Entertainment'];
const GROUP_TYPES = ['solo', 'couple', 'family', 'friends'];

export default function TripCreate() {
  const { state } = useLocation();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [form, setForm] = useState({
    destinationId: state?.destinationId || '',
    startDate: state?.startDate || '',
    endDate: '',
    travelers: Number(state?.travelers) || 2,
    groupType: 'couple',
    budget: Number(state?.budget) || 20000,
    travelStyle: 'Balanced',
    interests: [],
    hotelId: '',
    customAccommodation: '',
  });

  useEffect(() => {
    api.get('/destinations').then((res) => setDestinations(res.data));
  }, []);

  useEffect(() => {
    if (!form.destinationId) return;
    api.get(`/destinations/${form.destinationId}/places`).then((res) => {
      setHotels(res.data.filter((p) => p.type === 'hotel'));
    });
  }, [form.destinationId]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleInterest(interest) {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(interest) ? f.interests.filter((i) => i !== interest) : [...f.interests, interest],
    }));
  }

  function numDays() {
    if (!form.startDate || !form.endDate) return 1;
    const diff = (new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.round(diff) + 1);
  }

  async function handleGenerate() {
    if (!user) {
      showToast('Please log in to save your trip.', 'info');
      navigate('/login');
      return;
    }
    const hotel = hotels.find((h) => h.id === form.hotelId);
    try {
      const tripRes = await api.post('/trips', {
        destinationId: form.destinationId,
        startDate: form.startDate,
        endDate: form.endDate,
        numDays: numDays(),
        travelers: form.travelers,
        groupType: form.groupType,
        budget: form.budget,
        travelStyle: form.travelStyle,
        interests: form.interests,
        hotel: hotel ? { id: hotel.id, name: hotel.name, latitude: hotel.latitude, longitude: hotel.longitude } : { name: form.customAccommodation },
      });
      showToast('Trip created! Finding your recommendations...', 'success');
      navigate(`/trips/${tripRes.data.id}/recommendations`);
    } catch (err) {
      showToast('Could not create trip. Please try again.', 'error');
    }
  }

  const destination = destinations.find((d) => d.id === form.destinationId);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-ink">Plan your trip</h1>

      {/* Step indicator */}
      <div className="mt-6 flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${i === step ? 'bg-primary text-white' : i < step ? 'bg-primary/10 text-primary-dark' : 'bg-bg-soft text-muted'}`}>
            {i < step && <Check size={12} />} {s}
          </div>
        ))}
      </div>

      <Card className="mt-6 p-6 sm:p-8">
        {step === 0 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-ink">Where are you headed?</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {destinations.map((d) => (
                <button
                  key={d.id}
                  onClick={() => update('destinationId', d.id)}
                  className={`rounded-xl border p-3 text-left text-sm font-medium transition-colors ${form.destinationId === d.id ? 'border-primary bg-primary/5 text-primary-dark' : 'border-ink/10 text-ink hover:border-primary/50'}`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-ink">When are you traveling?</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Start date" type="date" value={form.startDate} onChange={(e) => update('startDate', e.target.value)} />
              <Input label="End date" type="date" value={form.endDate} onChange={(e) => update('endDate', e.target.value)} />
            </div>
            {form.startDate && form.endDate && <p className="mt-3 text-sm text-muted">{numDays()} day trip</p>}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-ink">Who's traveling?</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Number of travelers" type="number" min={1} value={form.travelers} onChange={(e) => update('travelers', Number(e.target.value))} />
              <Select label="Group type" value={form.groupType} onChange={(e) => update('groupType', e.target.value)}>
                {GROUP_TYPES.map((g) => <option key={g} value={g} className="capitalize">{g}</option>)}
              </Select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-ink">What's your total budget?</h2>
            <Input label="Total budget (₹)" type="number" value={form.budget} onChange={(e) => update('budget', Number(e.target.value))} />
            <p className="mt-2 text-sm text-muted">≈ ₹{Math.round(form.budget / form.travelers)} per person</p>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-ink">Pick a travel style</h2>
            <div className="grid grid-cols-3 gap-3">
              {TRAVEL_STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => update('travelStyle', s)}
                  className={`rounded-xl border p-4 text-sm font-medium transition-colors ${form.travelStyle === s ? 'border-primary bg-primary/5 text-primary-dark' : 'border-ink/10 text-ink hover:border-primary/50'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-ink">What are you interested in?</h2>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest.toLowerCase())}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${form.interests.includes(interest.toLowerCase()) ? 'border-primary bg-primary text-white' : 'border-ink/10 text-ink hover:border-primary/50'}`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-ink">Where will you stay?</h2>
            <div className="space-y-2">
              {hotels.map((h) => (
                <button
                  key={h.id}
                  onClick={() => update('hotelId', h.id)}
                  className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-sm transition-colors ${form.hotelId === h.id ? 'border-primary bg-primary/5' : 'border-ink/10 hover:border-primary/50'}`}
                >
                  <span className="font-medium text-ink">{h.name}</span>
                  <span className="text-muted">₹{h.estimatedCost}/night</span>
                </button>
              ))}
            </div>
            <p className="my-3 text-center text-xs text-muted">— or —</p>
            <Input
              label="Enter your own accommodation"
              placeholder="Hotel name / address"
              value={form.customAccommodation}
              onChange={(e) => { update('customAccommodation', e.target.value); update('hotelId', ''); }}
            />
          </div>
        )}

        {step === 7 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-ink">Trip summary</h2>
            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              <dt className="text-muted">Destination</dt><dd className="font-medium text-ink">{destination?.name}</dd>
              <dt className="text-muted">Dates</dt><dd className="font-medium text-ink">{form.startDate} → {form.endDate} ({numDays()} days)</dd>
              <dt className="text-muted">Travelers</dt><dd className="font-medium text-ink">{form.travelers} ({form.groupType})</dd>
              <dt className="text-muted">Budget</dt><dd className="font-medium text-ink">₹{form.budget}</dd>
              <dt className="text-muted">Travel style</dt><dd className="font-medium text-ink">{form.travelStyle}</dd>
              <dt className="text-muted">Interests</dt><dd className="font-medium capitalize text-ink">{form.interests.join(', ') || 'None selected'}</dd>
              <dt className="text-muted">Stay</dt><dd className="font-medium text-ink">{hotels.find((h) => h.id === form.hotelId)?.name || form.customAccommodation || 'Not set'}</dd>
            </dl>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Back</Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={step === 0 && !form.destinationId}>Continue</Button>
          ) : (
            <Button onClick={handleGenerate}>Get Recommendations</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
