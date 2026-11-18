import { Utensils, MapPin, Clock, Check, X } from 'lucide-react';
import Badge from './ui/Badge';

// Keeps activities chronological after a time edit — times are stored as
// "HH:MM" strings, which sort correctly as plain strings.
function sortByTime(activities) {
  return [...activities].sort((a, b) => a.time.localeCompare(b.time));
}

export default function ItineraryDay({ day, editable = false, onUpdateActivities }) {
  function updateActivity(index, changes) {
    const updated = day.activities.map((a, i) => (i === index ? { ...a, ...changes } : a));
    onUpdateActivities(sortByTime(updated));
  }

  function removeActivity(index) {
    onUpdateActivities(day.activities.filter((_, i) => i !== index));
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ink">{day.title}</h3>
        <div className="flex items-center gap-2 text-sm">
          <Badge variant={day.overBudget ? 'danger' : 'neutral'}>₹{day.estimatedCost}</Badge>
          <span className="text-muted">{day.distanceKm} km</span>
        </div>
      </div>

      <ol className="space-y-4 border-l border-ink/10 pl-4">
        {day.activities.map((activity, i) => (
          <li key={i} className="group relative">
            <span className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full ${activity.visited ? 'bg-success' : 'bg-primary'}`} />
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                {editable ? (
                  <input
                    type="time"
                    value={activity.time}
                    onChange={(e) => updateActivity(i, { time: e.target.value })}
                    className="rounded-md border border-ink/10 px-1.5 py-0.5 text-xs font-medium text-muted focus:border-primary focus:outline-none"
                  />
                ) : (
                  <p className="text-xs font-medium text-muted">{activity.time}</p>
                )}
                <p className={`flex items-center gap-1.5 font-medium ${activity.visited ? 'text-muted line-through' : 'text-ink'}`}>
                  {activity.type === 'meal' ? <Utensils size={14} /> : <MapPin size={14} />}
                  {activity.type === 'meal' ? activity.label : activity.name}
                </p>
                {activity.type === 'place' && activity.visitDuration > 0 && (
                  <p className="flex items-center gap-1 text-xs text-muted"><Clock size={11} /> ~{Math.round(activity.visitDuration / 60) || 1}h</p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="text-sm font-medium text-ink">
                  {activity.estimatedCost > 0 ? `₹${activity.estimatedCost}` : 'Free'}
                </span>
                {editable && activity.type === 'place' && (
                  <button
                    type="button"
                    onClick={() => updateActivity(i, { visited: !activity.visited })}
                    title={activity.visited ? 'Mark as not visited' : 'Mark as visited'}
                    className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                      activity.visited ? 'border-success bg-success text-white' : 'border-ink/15 text-transparent hover:border-success hover:text-success'
                    }`}
                  >
                    <Check size={13} />
                  </button>
                )}
                {editable && (
                  <button
                    type="button"
                    onClick={() => removeActivity(i)}
                    title="Remove from itinerary"
                    className="flex h-6 w-6 items-center justify-center rounded-full text-muted opacity-0 transition-opacity hover:bg-red-50 hover:text-danger group-hover:opacity-100"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
