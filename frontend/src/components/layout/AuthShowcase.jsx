import { Link } from 'react-router-dom';
import { Sparkles, Route, Wallet } from 'lucide-react';
import Logo from '../Logo';

const FEATURES = [
  { icon: Sparkles, title: 'Personalized recommendations', text: 'Curated around what you love' },
  { icon: Route, title: 'Smart day-by-day itineraries', text: 'Planned around your time and interests' },
  { icon: Wallet, title: 'Budget-aware planning', text: 'Designed around what you want to spend' },
];

export default function AuthShowcase() {
  return (
    <div className="relative hidden overflow-hidden lg:block">
      <img
        src="https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Gradient is shaped to keep the sky and horizon visible, darkening
          only where the text sits so the photo still reads as photography
          rather than a flat color filter. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/75" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <div className="relative flex h-full flex-col justify-between px-12 py-11 text-white">
        <Link to="/" className="w-fit">
          <Logo light />
        </Link>

        <div>
          <h1 className="text-[3.25rem] font-extrabold leading-[0.98] tracking-tight">
            Plan <span className="text-primary">smarter.</span><br />Travel <span className="text-primary">better.</span>
          </h1>
          <div className="mt-5 h-1 w-16 rounded-full bg-primary" />

          <ul className="mt-10 space-y-6">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex items-start gap-3.5">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-white/15 bg-white/10">
                  <f.icon size={16} strokeWidth={2} />
                </span>
                <span>
                  <span className="block text-[15px] font-semibold">{f.title}</span>
                  <span className="block text-[13px] text-white/70">{f.text}</span>
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-10 max-w-xs text-[15px] leading-snug text-white/85">
            Your budget. Your interests.<br />
            <span className="font-semibold text-primary">Your perfect itinerary.</span>
          </p>
        </div>

        <p className="text-xs leading-relaxed text-white/55">
          © {new Date().getFullYear()} Trivyo<br />Travel planning, reimagined.
        </p>
      </div>
    </div>
  );
}
