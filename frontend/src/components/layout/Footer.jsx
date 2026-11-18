import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const EXPLORE_LINKS = [
  { to: '/destinations', label: 'Destinations' },
  { to: '/trips/new', label: 'Plan a trip' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/#how-it-works', label: 'How it works' },
];

const ACCOUNT_LINKS = [
  { to: '/login', label: 'Log in' },
  { to: '/register', label: 'Sign up' },
  { to: '/trips', label: 'My trips' },
  { to: '/dashboard', label: 'Dashboard' },
];

const DESTINATIONS = ['Goa', 'Hyderabad', 'Jaipur', 'Manali', 'Kerala'];

export default function Footer() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');

  function handleSubscribe(e) {
    e.preventDefault();
    showToast("Newsletter signup isn't available yet — coming soon!", 'info');
    setEmail('');
  }

  return (
    <footer className="relative overflow-hidden border-t border-[#F0EDE8] bg-bg">
      {/* Extremely subtle route detail — a hint of a travel map, not an illustration */}
      <svg className="pointer-events-none absolute -right-4 -top-4 h-40 w-40 text-primary opacity-[0.06]" viewBox="0 0 160 160" fill="none">
        <path d="M 10 130 Q 50 60, 90 90 T 150 20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1 7" strokeLinecap="round" />
        <circle cx="10" cy="130" r="3" fill="currentColor" />
        <circle cx="90" cy="90" r="3" fill="currentColor" />
        <circle cx="150" cy="20" r="3" fill="currentColor" />
      </svg>

      <div className="relative mx-auto max-w-[1300px] px-4 pb-10 pt-16 sm:px-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4 lg:gap-x-10">
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="text-3xl font-extrabold tracking-tight text-[#172033]">
              Trivyo<span className="text-primary">.</span>
            </Link>
            <p className="mt-4 max-w-[360px] text-sm leading-relaxed text-[#64748B]">
              Plan smarter. Travel better. Personalized itineraries built around your budget, interests and travel style.
            </p>
            <a href="mailto:hello@trivyo.app" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#172033] transition-colors duration-150 hover:text-primary">
              <Mail size={15} className="text-primary" /> hello@trivyo.app
            </a>
          </div>

          <div>
            <p className="text-[15px] font-semibold text-[#172033]">Explore</p>
            <ul className="mt-4 space-y-3 text-sm text-[#64748B]">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition-colors duration-150 hover:text-primary">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[15px] font-semibold text-[#172033]">Account</p>
            <ul className="mt-4 space-y-3 text-sm text-[#64748B]">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition-colors duration-150 hover:text-primary">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[15px] font-semibold text-[#172033]">Popular destinations</p>
            <ul className="mt-4 space-y-3 text-sm text-[#64748B]">
              {DESTINATIONS.map((name) => (
                <li key={name}>
                  <Link to={`/destinations/${name.toLowerCase()}`} className="flex items-center gap-1.5 transition-colors duration-150 hover:text-primary">
                    <MapPin size={12} className="text-primary" /> {name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/destinations" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors duration-150 hover:text-primary-dark">
              View all destinations <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Newsletter — a final product CTA, not the footer's centerpiece */}
        <form
          onSubmit={handleSubscribe}
          className="mt-4 flex flex-col gap-5 rounded-[20px] border border-[#E7E5E4] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF1E6] text-primary">
              <Mail size={17} />
            </span>
            <div>
              <p className="text-lg font-bold text-[#172033]">Get travel inspiration &amp; updates</p>
              <p className="text-sm text-[#64748B]">Be the first to know when new destinations and features land.</p>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-[52px] w-full rounded-xl border border-[#E7E5E4] px-4 text-sm focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/10 sm:w-[300px]"
            />
            <button
              type="submit"
              className="flex h-[52px] shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary px-6 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-dark"
            >
              Subscribe <ArrowRight size={15} />
            </button>
          </div>
        </form>

        <div className="mt-10 border-t border-[#E7E5E4] pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-[13px] text-[#64748B] sm:flex-row">
            <p>© {new Date().getFullYear()} Trivyo. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="transition-colors duration-150 hover:text-primary">Privacy Policy</Link>
              <span className="h-3 w-px bg-[#E7E5E4]" />
              <Link to="/terms" className="transition-colors duration-150 hover:text-primary">Terms of Service</Link>
            </div>
            <p className="flex items-center gap-1.5">Made with <span className="text-primary">♥</span> for travelers</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
