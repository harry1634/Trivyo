import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Compass, Sparkles, Route, PiggyBank, Map as MapIcon, Star, ArrowRight, ChevronRight, ChevronLeft, ChevronDown, Users, Wallet, Calendar, CheckCircle2, Sun, Heart } from 'lucide-react';
import Button from '../components/ui/Button';
import DestinationHighlightCard from '../components/DestinationHighlightCard';
import { CardSkeletonGrid } from '../components/ui/LoadingSkeleton';
import api from '../services/api';

const HOW_IT_WORKS = [
  { icon: Compass, title: 'Choose your destination', text: 'Browse curated destinations or search for the one you have in mind.' },
  { icon: Sparkles, title: 'Tell us your preferences', text: 'Budget, dates, travel style and interests — takes under a minute.' },
  { icon: Route, title: 'Get personalized recommendations', text: 'Our engine ranks places by match, distance, budget and popularity.' },
  { icon: MapIcon, title: 'Generate your itinerary', text: 'A day-wise plan with timings, costs and a map, ready to edit.' },
];

const WHY_TRIVYO = [
  { icon: Sparkles, title: 'Smart Recommendations', text: 'Transparent, rule-based scoring — not a black box.', detail: '5-factor match score' },
  { icon: PiggyBank, title: 'Budget Friendly', text: 'Every suggestion accounts for what you actually have to spend.', detail: 'Spend tracked by category' },
  { icon: MapIcon, title: 'Distance Aware', text: 'Plans that respect how far things really are from your stay.', detail: 'Ranked by distance from your hotel' },
  { icon: Route, title: 'Personalized Itineraries', text: 'Built around your interests and travel style, day by day.', detail: 'Fully editable, day by day' },
];

const STATS = [
  { icon: MapPin, value: '5', label: 'Curated destinations' },
  { icon: Compass, value: '100+', label: 'Places to explore' },
  { icon: Sparkles, value: '5-factor', label: 'Recommendation engine' },
];

const TRAVELER_OPTIONS = [1, 2, 3, 4, 5, 6];

export default function Home() {
  const navigate = useNavigate();
  const scrollerRef = useRef(null);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ destination: '', travelers: 2, budget: '' });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    api.get('/destinations')
      .then((res) => setDestinations(res.data))
      .catch(() => setDestinations([]))
      .finally(() => setLoading(false));
  }, []);

  // Lets footer links like "How it works" (from any page) land here and
  // scroll to the right section, since it's not a route of its own.
  useEffect(() => {
    if (window.location.hash === '#how-it-works') {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  function updateScrollButtons() {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    updateScrollButtons();
  }, [destinations]);

  function handlePlanTrip(e) {
    e.preventDefault();
    navigate('/trips/new', { state: search });
  }

  function scrollDestinations(direction) {
    scrollerRef.current?.scrollBy({ left: direction * 340, behavior: 'smooth' });
  }

  return (
    <div>
      {/* Hero — one cinematic composition: the photo is a full-bleed background
          layer behind the whole section, not a boxed image next to the text.
          A left-to-right cream gradient keeps the headline readable while the
          beach/palm detail on the right stays untouched. */}
      <section className="relative overflow-hidden pb-8 pt-6 lg:min-h-[595px] lg:pt-8">
        <img
          src="/hero-beach.png"
          alt="Tropical beach at sunset"
          className="absolute inset-0 hidden h-full w-full object-cover object-center sm:block"
        />
        <div
          className="absolute inset-0 hidden sm:block"
          style={{
            background:
              'linear-gradient(90deg, rgba(255,253,249,1) 0%, rgba(255,253,249,0.95) 28%, rgba(255,253,249,0.65) 48%, rgba(255,253,249,0.15) 68%, rgba(255,253,249,0.03) 82%)',
          }}
        />
        {/* Plain warm background for mobile, where the photo becomes its own
            block below the text instead of sitting behind it. */}
        <div className="absolute inset-0 bg-bg sm:hidden" />

        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6">
          {/* Positioning root for the text column + floating cards, scoped to
              just this content's own height — NOT the taller block below that
              also contains the planner. Anchoring the secondary image's `bottom`
              to that taller container was why it landed on top of the planner. */}
          <div className="relative">
            <div className="max-w-[560px]">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#FFF1E6]/90 px-3 py-1 text-xs font-semibold text-primary-dark">
                <Sparkles size={12} /> Personalized trips, built for you
              </span>
              <h1 className="mt-7 text-4xl font-extrabold leading-[1.05] tracking-tight text-[#172033] sm:text-[3.25rem] sm:leading-[0.98] lg:text-[3.75rem]">
                Plan Smarter.<br /><span className="text-primary">Travel Better.</span>
              </h1>
              <p className="mt-6 max-w-[500px] text-base leading-relaxed text-[#64748B] sm:text-lg">
                Your destination, budget and interests — turned into a trip that fits you.
              </p>
              <div className="mt-7 flex flex-wrap gap-3.5">
                <Button as="a" href="/trips/new" size="lg" className="rounded-[14px]">
                  Plan My Trip <ArrowRight size={16} />
                </Button>
                <Button as="a" href="/destinations" variant="outline" size="lg" className="rounded-[14px] border-[#E7E5E4] bg-white/70 backdrop-blur-sm">
                  <Compass size={16} /> Explore Destinations
                </Button>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-4 lg:flex-nowrap">
                {STATS.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <stat.icon size={16} />
                    </span>
                    <div className="whitespace-nowrap">
                      <p className="text-base font-bold leading-tight text-[#172033]">{stat.value}</p>
                      <p className="text-[11px] leading-tight text-[#64748B]">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Match card, floating directly on the background photo
                (desktop/tablet only — the photo itself isn't shown on mobile). */}
            <div className="absolute right-4 top-8 hidden w-[165px] rounded-2xl bg-white p-3.5 shadow-lg ring-1 ring-black/5 sm:right-6 sm:block lg:right-10">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                <Star size={14} className="fill-amber-400 text-amber-400" />
              </span>
              <p className="mt-2 text-sm font-bold text-[#172033]">96% Match</p>
              <p className="text-xs text-[#64748B]">Baga Beach, Goa</p>
              <p className="text-xs font-medium text-success">Perfect for you</p>
            </div>

            {/* Sits in the gradient's mid transition zone — just past the text
                column, before the photo's busy palm/resort detail on the right —
                instead of stacked on top of that detail or near the planner. */}
            <img
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500"
              alt="Mountain lake getaway"
              className="absolute left-[600px] top-1/2 hidden h-[110px] w-[165px] -translate-y-1/2 rounded-2xl object-cover shadow-lg ring-4 ring-white lg:block xl:left-[650px]"
            />
          </div>

          {/* Mobile-only: the photo becomes its own block after the text,
              per the stacking order (badge → headline → ... → image → planner). */}
          <div className="relative mt-8 h-56 w-full overflow-hidden rounded-2xl shadow-lg sm:hidden">
            <img src="/hero-beach.png" alt="Tropical beach at sunset" className="h-full w-full object-cover" />
            <div className="absolute right-3 top-3 w-[140px] rounded-xl bg-white p-2.5 shadow-lg">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                <Star size={11} className="fill-amber-400 text-amber-400" />
              </span>
              <p className="mt-1 text-xs font-bold text-[#172033]">96% Match</p>
              <p className="text-[10px] text-[#64748B]">Baga Beach, Goa</p>
            </div>
          </div>

          {/* Planner card — sits in normal flow right at the hero's bottom edge.
              Deliberately NOT absolutely positioned/overlapping: that caused it
              to land on top of the stats row. Elevation comes from shadow + border
              contrast against the cream background instead of geometric overlap.
              Extra top margin (mt-20 vs. the previous mt-10) clears more of the
              background photo before the card starts. */}
          <div className="relative z-10 mx-auto mt-16 flex justify-center lg:mt-20 lg:max-w-[1160px]">
            <form
              onSubmit={handlePlanTrip}
              className="grid w-full grid-cols-1 gap-5 rounded-[20px] border border-[#E7E5E4] bg-white p-5 shadow-[0_12px_32px_-16px_rgba(23,32,51,0.18)] sm:grid-cols-4 sm:gap-4 sm:p-5"
            >
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-[#172033]">Where do you want to go?</span>
                <div className="relative">
                  <MapPin size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A3A3A3]" />
                  <input
                    placeholder="e.g. Goa, Manali, Kerala"
                    className="h-[48px] w-full rounded-[11px] border border-[#E7E5E4] bg-white pl-11 pr-4 text-sm text-ink placeholder:text-[#A3A3A3] focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/10"
                    value={search.destination}
                    onChange={(e) => setSearch((s) => ({ ...s, destination: e.target.value }))}
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-[#172033]">Travel dates</span>
                {/* Native date inputs already render their own calendar affordance —
                    an extra icon layered on top was a duplicate, not a second field. */}
                <input
                  type="date"
                  className="h-[48px] w-full rounded-[11px] border border-[#E7E5E4] bg-white px-4 text-sm text-ink focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/10"
                  onChange={(e) => setSearch((s) => ({ ...s, startDate: e.target.value }))}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-[#172033]">Travelers</span>
                <div className="relative">
                  <Users size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A3A3A3]" />
                  <select
                    className="h-[48px] w-full appearance-none rounded-[11px] border border-[#E7E5E4] bg-white pl-11 pr-9 text-sm text-ink focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/10"
                    value={search.travelers}
                    onChange={(e) => setSearch((s) => ({ ...s, travelers: Number(e.target.value) }))}
                  >
                    {TRAVELER_OPTIONS.map((n) => (
                      <option key={n} value={n}>{n} Traveler{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#A3A3A3]" />
                </div>
              </label>

              <div>
                <span className="mb-1.5 block text-sm font-semibold text-[#172033]">Budget (₹)</span>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#A3A3A3]">₹</span>
                    <input
                      type="number"
                      placeholder="30000"
                      className="h-[48px] w-full rounded-[11px] border border-[#E7E5E4] bg-white pl-8 pr-4 text-sm text-ink placeholder:text-[#A3A3A3] focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/10"
                      value={search.budget}
                      onChange={(e) => setSearch((s) => ({ ...s, budget: e.target.value }))}
                    />
                  </div>
                  <Button type="submit" rounded="md" className="h-[48px] shrink-0 px-4"><Search size={16} /></Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Popular destinations — pt-14 (56px) here plus the hero's own pb-8 (32px)
          gives ~88px of clear space below the planner card before this heading,
          the deliberate separation called for between hero/planner/destinations. */}
      <section className="mx-auto max-w-[1440px] px-4 pb-20 pt-14 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Handpicked for you</p>
            <h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">Handpicked destinations</h2>
          </div>
          <Button as="a" href="/destinations" variant="ghost">View all destinations <ArrowRight size={14} /></Button>
        </div>

        {loading ? (
          <CardSkeletonGrid count={4} />
        ) : (
          <div className="relative">
            <div
              ref={scrollerRef}
              onScroll={updateScrollButtons}
              className="flex gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {destinations.map((d) => (
                <div key={d.id} className="w-72 shrink-0">
                  <DestinationHighlightCard destination={d} />
                </div>
              ))}
            </div>

            {/* Fades hint there's more to scroll in that direction — shown/hidden
                together with their matching button so they never contradict it. */}
            {canScrollLeft && (
              <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-bg to-transparent sm:block" />
            )}
            {canScrollRight && (
              <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-bg to-transparent sm:block" />
            )}

            {canScrollLeft && (
              <button
                onClick={() => scrollDestinations(-1)}
                aria-label="Scroll destinations left"
                className="absolute -left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-lg ring-1 ring-ink/10 transition-colors hover:bg-bg-soft sm:flex"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={() => scrollDestinations(1)}
                aria-label="Scroll destinations right"
                className="absolute -right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-lg ring-1 ring-ink/10 transition-colors hover:bg-bg-soft sm:flex"
              >
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        )}
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 bg-bg-soft/60 py-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
          <div className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Simple by design</p>
            <h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">How Trivyo Works</h2>
            <p className="mx-auto mt-3 max-w-lg text-muted">
              From your ideas to the perfect itinerary — our smart travel engine does the planning, so you can enjoy the journey.
            </p>
          </div>

          <div className="relative grid grid-cols-1 gap-y-14 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-6">
            {/* Arrow connectors between steps, desktop only */}
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="pointer-events-none absolute top-9 hidden -translate-x-1/2 items-center lg:flex"
                style={{ left: `${n * 25}%`, width: 'calc(25% - 3.5rem)', marginLeft: '-0.75rem' }}
              >
                <div className="h-0 w-full border-t-2 border-dashed border-primary/30" />
                <ChevronRight size={16} className="ml-1 shrink-0 text-primary/50" />
              </div>
            ))}

            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.title} className="group relative text-center">
                <div className="relative mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-primary/10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary shadow-sm ring-1 ring-ink/5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
                    <step.icon size={24} />
                  </div>
                  <span className="absolute -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white ring-4 ring-bg-soft">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-ink">{step.title}</h3>
                <p className="mx-auto mt-1.5 max-w-[220px] text-sm leading-relaxed text-muted">{step.text}</p>

                {/* Step preview mockup — staggered up/down on desktop (odd
                    columns sit lower) so the row reads as composed, not a
                    flat strip of identical-height cards. */}
                <div className={`mt-5 ${i % 2 === 1 ? 'lg:mt-12' : 'lg:mt-5'}`}>
                  {i === 0 && (
                    <div className="relative h-40 overflow-hidden rounded-2xl shadow-sm ring-1 ring-ink/5">
                      <img
                        src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500"
                        alt="Baga Beach, Goa"
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md">
                        <MapPin size={14} className="text-primary" />
                      </span>
                    </div>
                  )}

                  {i === 1 && (
                    <div className="h-40 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-ink/5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 font-medium text-ink"><Wallet size={13} className="text-primary" /> Budget</span>
                        <span className="font-semibold text-ink">₹30,000</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full rounded-full bg-bg-soft">
                        <div className="h-full w-2/3 rounded-full bg-primary" />
                      </div>
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-ink">
                        <Calendar size={13} className="text-primary" /> 12 – 16 May
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white">Nature</span>
                        <span className="rounded-full bg-bg-soft px-2 py-0.5 text-[10px] font-medium text-muted">Adventure</span>
                        <span className="rounded-full bg-bg-soft px-2 py-0.5 text-[10px] font-medium text-muted">Relaxation</span>
                      </div>
                    </div>
                  )}

                  {i === 2 && (
                    <div className="flex h-40 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5">
                      <img
                        src="https://images.unsplash.com/photo-1719831738921-972e0ec76337?w=300"
                        alt="Munnar tea gardens, Kerala"
                        className="h-full w-2/5 object-cover"
                      />
                      <div className="flex-1 p-3 text-left">
                        <p className="text-sm font-bold text-success">96% Match</p>
                        <p className="text-[11px] text-muted">Munnar, Kerala</p>
                        <ul className="mt-2 space-y-1 text-[11px] text-ink/80">
                          <li className="flex items-center gap-1.5"><Sun size={12} className="text-success" /> Great weather</li>
                          <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-success" /> Within budget</li>
                          <li className="flex items-center gap-1.5"><Star size={12} className="text-success" /> Highly rated</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {i === 3 && (
                    <div className="flex h-40 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5">
                      <div className="flex-1 space-y-2 p-3 text-left text-[11px]">
                        <div>
                          <p className="font-semibold text-ink">Day 1 · Arrival</p>
                          <p className="text-muted">₹4,500</p>
                        </div>
                        <div>
                          <p className="font-semibold text-ink">Day 2 · Nature & Adventure</p>
                          <p className="text-muted">₹5,200</p>
                        </div>
                        <div>
                          <p className="font-semibold text-ink">Day 3 · Local Experiences</p>
                          <p className="text-muted">₹3,800</p>
                        </div>
                      </div>
                      <div className="relative w-2/5 bg-bg-soft">
                        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path d="M 20 15 Q 70 30, 40 55 T 75 85" fill="none" stroke="#F97316" strokeWidth="2" strokeDasharray="3 3" />
                        </svg>
                        <MapPin size={14} className="absolute left-[14%] top-[8%] -translate-x-1/2 -translate-y-full text-primary" fill="#F97316" />
                        <MapPin size={14} className="absolute left-[36%] top-[50%] -translate-x-1/2 -translate-y-full text-primary" fill="#F97316" />
                        <MapPin size={14} className="absolute left-[71%] top-[80%] -translate-x-1/2 -translate-y-full text-primary" fill="#F97316" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Closing strip */}
          <div className="mt-14 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white px-6 py-5 text-center shadow-sm ring-1 ring-ink/5 sm:flex-row sm:gap-6 sm:text-left">
            <span className="flex items-center gap-2 font-semibold text-ink">
              <Sparkles size={16} className="text-primary" /> Smart planning. Seamless experience.
            </span>
            <span className="hidden h-5 w-px bg-ink/10 sm:block" />
            <span className="text-sm text-muted">Trivyo handles the details, you make the memories.</span>
          </div>
        </div>
      </section>

      {/* Why Trivyo */}
      <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">The difference</p>
          <h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">Why Trivyo?</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_TRIVYO.map((item) => (
            <div key={item.title} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="absolute inset-x-0 top-0 h-1 scale-x-0 bg-gradient-to-r from-primary to-primary-dark transition-transform duration-300 group-hover:scale-x-100" />
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-sm">
                <item.icon size={20} />
              </div>
              <h3 className="font-semibold text-ink">{item.title}</h3>
              <p className="mt-1 text-sm text-muted">{item.text}</p>
              <p className="mt-4 inline-flex items-center rounded-full bg-bg-soft px-2.5 py-1 text-[11px] font-medium text-primary-dark">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden py-24 text-center">
        <img
          src="/hero-beach.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Light warm wash instead of a dark tint — the photo stays visible
            through it, matching the airier reference treatment. */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/55 via-white/60 to-white/75" />

        <div className="relative mx-auto max-w-2xl px-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary-dark shadow-sm backdrop-blur-sm">
            <Sparkles size={12} /> Free to plan, no bookings required
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#172033] sm:text-4xl">
            Your next <span className="text-primary">adventure</span> starts here.
          </h2>
          <p className="mt-3 text-[#64748B]">Tell us where, when and how much — Trivyo handles the rest.</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button as="a" href="/trips/new" size="lg">
              Plan My Trip <ArrowRight size={16} />
            </Button>
            <Button as="a" href="/destinations" variant="outline" size="lg" className="border-[#E7E5E4] bg-white/90 backdrop-blur-sm">
              Browse Destinations
            </Button>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 rounded-2xl bg-white/70 p-3 shadow-sm backdrop-blur-sm sm:flex-row sm:gap-0 sm:divide-x sm:divide-ink/10">
            {[
              { icon: PiggyBank, title: 'Budget-aware plans', text: 'Trips that fit your budget' },
              { icon: MapIcon, title: 'Distance-aware routing', text: 'Optimized travel routes' },
              { icon: Route, title: 'Editable itineraries', text: 'Customize your trip easily' },
            ].map((f) => (
              <div key={f.title} className="flex flex-1 items-center gap-3 px-4 py-2 text-left">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                  <f.icon size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#172033]">{f.title}</p>
                  <p className="text-xs text-[#64748B]">{f.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Honest product statement — not a fabricated user/review count */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-white/70 px-5 py-3 shadow-sm backdrop-blur-sm">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Heart size={16} fill="currentColor" />
            </span>
            <div className="text-left">
              <p className="text-sm font-semibold text-[#172033]">Free to use, no strings attached</p>
              <p className="text-xs text-[#64748B]">Plan smarter. Travel happier.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
