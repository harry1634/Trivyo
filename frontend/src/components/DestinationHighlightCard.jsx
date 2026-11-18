import { Link } from 'react-router-dom';
import { Mountain, Waves, Landmark, Sparkles, Compass } from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';

// Maps a destination's primary tag to a short, human tagline + icon for the
// small pill shown under its name — purely presentational, derived from data
// that's already on the destination rather than hardcoded per-destination.
const TAG_PRESENTATION = {
  beach: { icon: Waves, label: 'Beach escape' },
  nature: { icon: Mountain, label: 'Best for nature' },
  adventure: { icon: Compass, label: 'Adventure trip' },
  history: { icon: Landmark, label: 'Culture trip' },
  culture: { icon: Landmark, label: 'Culture trip' },
  food: { icon: Sparkles, label: 'Food & flavors' },
  family: { icon: Mountain, label: 'Relax & unwind' },
  photography: { icon: Sparkles, label: 'Photo-worthy' },
  nightlife: { icon: Sparkles, label: 'Vibrant nights' },
  shopping: { icon: Landmark, label: 'Shopping & bazaars' },
};

function getTagPresentation(destination) {
  const primaryTag = destination.tags?.[0];
  return TAG_PRESENTATION[primaryTag] || { icon: Compass, label: 'Worth exploring' };
}

export default function DestinationHighlightCard({ destination }) {
  const { icon: TagIcon, label } = getTagPresentation(destination);
  // Goa and Kerala are both state-and-destination-name-in-one (e.g. state:
  // "Goa" for the Goa destination), so showing state would just repeat the
  // heading above it — fall back to country in that case instead.
  const subtitle = destination.state === destination.name ? destination.country : destination.state;

  return (
    <Link to={`/destinations/${destination.id}`} className="group block w-full shrink-0 sm:w-auto">
      <div className="relative h-80 w-full overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5">
        <img
          src={destination.coverImage || FALLBACK_IMAGE}
          onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
          alt={`${destination.name}, ${destination.country}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="text-xl font-extrabold leading-tight tracking-tight text-white">{destination.name}</h3>
          <p className="mt-0.5 text-sm text-white/80">{subtitle}</p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20 backdrop-blur-sm">
            <TagIcon size={12} /> {label}
          </span>
        </div>
      </div>
    </Link>
  );
}
