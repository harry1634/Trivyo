import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import DestinationCard from '../components/DestinationCard';
import { CardSkeletonGrid } from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import Input from '../components/ui/Input';
import api from '../services/api';

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get('/destinations')
      .then((res) => setDestinations(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = destinations.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase()) || d.tags?.some((t) => t.includes(query.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">Explore Destinations</h1>
      <p className="mt-1 text-muted">Curated places, ready for you to build a trip around.</p>

      <div className="relative mt-6 max-w-md">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <Input placeholder="Search destinations, tags..." className="pl-10" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="mt-8">
        {loading ? (
          <CardSkeletonGrid count={6} />
        ) : error ? (
          <EmptyState title="Couldn't load destinations" description="Check your connection and try again." />
        ) : filtered.length === 0 ? (
          <EmptyState title="No destinations found" description="Try a different search term." />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
