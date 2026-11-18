import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="relative mx-auto flex min-h-[75vh] max-w-lg flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Compass size={30} />
      </div>

      <p className="relative text-6xl font-bold tracking-tight text-primary">404</p>
      <h1 className="relative mt-3 text-xl font-semibold text-ink">This page seems to have wandered off the map</h1>
      <p className="relative mt-2 max-w-sm text-sm text-muted">
        The trip you're looking for doesn't exist, or the link may be out of date. Let's get you back on route.
      </p>

      <div className="relative mt-8 flex flex-wrap justify-center gap-3">
        <Button as={Link} to="/">Back home <ArrowRight size={16} /></Button>
        <Button as={Link} to="/destinations" variant="outline">Explore destinations</Button>
      </div>
    </div>
  );
}
