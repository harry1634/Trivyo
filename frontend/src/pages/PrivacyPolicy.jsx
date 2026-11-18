export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated {new Date().getFullYear()}</p>

      <div className="prose mt-8 space-y-6 text-sm leading-relaxed text-ink/80">
        <p>
          Trivyo is a travel-planning demo product. This page explains what account and trip data
          we store and how it's used — there's no advertising network, data resale, or third-party
          tracking involved.
        </p>

        <div>
          <h2 className="text-lg font-semibold text-ink">What we store</h2>
          <p className="mt-2">
            When you create an account, we store your name, email address, and role. When you plan
            a trip, we store the destination, dates, budget, interests, accommodation choice, and
            any itinerary, favorites, or checklist items you create. This data is used solely to
            power the recommendation engine and your dashboard.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink">Where it's stored</h2>
          <p className="mt-2">
            Account and trip data is stored in Google Firebase (Authentication and Firestore).
            We don't operate our own servers for storing personal data beyond what Firebase manages.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink">What we don't do</h2>
          <p className="mt-2">
            We don't sell or share your data with advertisers, don't send marketing email (the
            newsletter signup in our footer isn't active yet), and don't use third-party analytics
            or tracking pixels.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink">Your data</h2>
          <p className="mt-2">
            You can delete your trips and favorites at any time from within the app. To request
            full account deletion, contact us at{' '}
            <a href="mailto:hello@trivyo.app" className="text-primary-dark">hello@trivyo.app</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
