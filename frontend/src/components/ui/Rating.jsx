import { Star } from 'lucide-react';

export default function Rating({ value, reviewCount, size = 14 }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-ink">
      <Star size={size} className="fill-amber-400 text-amber-400" />
      {value?.toFixed(1)}
      {reviewCount != null && <span className="text-muted font-normal">({reviewCount.toLocaleString()})</span>}
    </span>
  );
}
