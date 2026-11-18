export default function TermsOfService() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted">Last updated {new Date().getFullYear()}</p>

      <div className="prose mt-8 space-y-6 text-sm leading-relaxed text-ink/80">
        <div>
          <h2 className="text-lg font-semibold text-ink">What Trivyo is</h2>
          <p className="mt-2">
            Trivyo is a travel-planning tool: it recommends places and generates itineraries based
            on the preferences, budget, and dates you provide. It does not book flights, hotels,
            or any other travel service, and no payment is ever collected through this app.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink">Accuracy of recommendations</h2>
          <p className="mt-2">
            Destination and place information (costs, opening hours, ratings) is curated sample
            data intended to demonstrate the recommendation and itinerary-generation logic. Always
            verify prices, hours, and availability directly with the venue or a booking provider
            before you travel.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink">Your account</h2>
          <p className="mt-2">
            You're responsible for keeping your login credentials secure. You can delete trips,
            favorites, and checklist items you no longer want at any time.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink">No warranty</h2>
          <p className="mt-2">
            Trivyo is provided as-is, without warranty of any kind. We're not liable for any
            travel decisions made based on information shown in the app.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink">Contact</h2>
          <p className="mt-2">
            Questions about these terms? Reach us at{' '}
            <a href="mailto:hello@trivyo.app" className="text-primary-dark">hello@trivyo.app</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
