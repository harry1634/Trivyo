import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, XCircle, Heart, Trash2, MoreVertical } from 'lucide-react';

export default function TripActionsMenu({ trip, isFavorited, onMarkDone, onCancel, onSaveForLater, onDelete, className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const active = trip.status !== 'completed' && trip.status !== 'canceled';

  function run(action) {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
      action();
    };
  }

  return (
    <div className={`relative ${className}`} ref={ref} onClick={(e) => e.stopPropagation()}>
      <button
        onClick={run(() => setOpen((o) => !o))}
        aria-label="Trip options"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-muted shadow-sm ring-1 ring-ink/10 transition-colors hover:text-ink"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-10 mt-2 w-48 overflow-hidden rounded-xl border border-[#F0EDE8] bg-white py-1.5 shadow-lg">
          {active && (
            <button
              onClick={run(onMarkDone)}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-ink transition-colors hover:bg-bg-soft"
            >
              <CheckCircle2 size={14} className="text-green-600" /> Mark as done
            </button>
          )}
          {active && (
            <button
              onClick={run(onCancel)}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-ink transition-colors hover:bg-bg-soft"
            >
              <XCircle size={14} className="text-amber-600" /> Cancel trip
            </button>
          )}
          <button
            onClick={run(onSaveForLater)}
            disabled={isFavorited}
            className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-ink transition-colors hover:bg-bg-soft disabled:cursor-default disabled:text-muted disabled:hover:bg-transparent"
          >
            <Heart size={14} className={isFavorited ? 'fill-primary text-primary' : 'text-primary'} />
            {isFavorited ? 'Saved for later' : 'Save for later'}
          </button>
          <button
            onClick={run(onDelete)}
            className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-danger transition-colors hover:bg-red-50"
          >
            <Trash2 size={14} /> Delete trip
          </button>
        </div>
      )}
    </div>
  );
}
