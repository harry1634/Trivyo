# Trivyo — Plan Smarter. Travel Better.

Intelligent travel planning and personalized itinerary platform. B.Tech final-year project (V1 / MVP).

## Stack
- **Frontend:** React + Vite + Tailwind CSS v4 + React Router + Leaflet
- **Backend:** Node.js + Express (REST API)
- **Database/Auth:** Firebase (Firestore + Authentication)
- **Maps:** Leaflet + OpenStreetMap tiles (no paid Maps API)

## Project structure
```
frontend/   React app (pages, components, context, services)
server/     Express API (controllers, routes, services, config)
firestore.rules   Firestore security rules
```

## One-time setup

### 1. Create a Firebase project
1. Go to the [Firebase console](https://console.firebase.google.com) → create a project.
2. Enable **Authentication → Email/Password**.
3. Enable **Firestore Database** (production mode) and deploy `firestore.rules` from this repo.
4. Enable **Storage** if you plan to use profile photos.

### 2. Frontend env vars
Copy `frontend/.env.example` to `frontend/.env` and fill in the values from
Firebase console → Project settings → General → Your apps → Web app config.

### 3. Backend env vars
The backend uses **Firebase Admin SDK** (server-side, full access) to talk to Firestore.
1. Firebase console → Project settings → Service accounts → Generate new private key. Save as `serviceAccount.json` (never commit this).
2. Base64-encode it and put it in `server/.env` (copy from `server/.env.example`):
   ```bash
   node -e "console.log(Buffer.from(require('fs').readFileSync('serviceAccount.json')).toString('base64'))"
   ```

### 4. Install dependencies
```bash
cd frontend && npm install
cd ../server && npm install
```

### 5. Seed the database
Populates 5 destinations (Goa, Hyderabad, Jaipur, Manali, Kerala) and their
attractions/hotels/restaurants/cafes/activities — required for the
recommendation engine to have candidates to rank.
```bash
cd server
npm run seed
```

### 6. Run locally
```bash
# terminal 1
cd server && npm run dev      # http://localhost:5000

# terminal 2
cd frontend && npm run dev    # http://localhost:5173
```

### 7. Make yourself an admin (optional)
Register a normal account in the app, then in Firestore console manually
change that user's `role` field from `traveler` to `admin` to unlock `/admin`.

## How the recommendation engine works
See `server/services/recommendationEngine.js` and `server/config/recommendationWeights.js`.
Each place gets a 0–100 score from a weighted blend of:
preference match (35%), distance from your stay (20%), budget fit (20%),
popularity (15%), rating (10%). Weights are all defined in one config file.

## How itinerary generation works
`server/services/itineraryGenerator.js` ranks candidate places, groups them
into day-sized geographic clusters (nearest-neighbor chaining), inserts
meals, checks opening hours, and totals cost/distance per day.
`server/services/budgetOptimizer.js` handles the "Optimize Budget" flow:
it swaps low-match/high-cost places for cheaper alternatives first, then
drops the lowest-value remaining activities if that alone isn't enough.

## Deployment
- **Frontend:** deploy `frontend/` to Vercel (framework preset: Vite).
- **Backend:** deploy `server/` to Vercel as a Node serverless app (or any Node host). Set the same env vars as `server/.env.example`.
- Set `VITE_API_BASE_URL` on the frontend deployment to your deployed backend's `/api` URL.

## Out of scope for V1
Real booking/payments, flight tracking, live GPS navigation, ML-based
recommendations, microservices. See the project brief for the full list —
these are intentionally deferred to keep V1 demonstrable and maintainable.
