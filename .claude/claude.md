# TRIYYO — PROJECT CONTEXT

## 1. PRODUCT OVERVIEW

Triyyo is a personalized travel planning and itinerary optimization platform.

The product helps travelers create trips based on:

- destination
- travel dates
- number of travelers
- budget
- travel style
- interests
- accommodation location

Triyyo then provides:

- personalized place recommendations
- recommendation scores
- budget-aware recommendations
- distance-aware recommendations
- popularity-aware recommendations
- day-wise itinerary generation
- route/map visualization
- trip budget planning
- favorites/wishlist
- travel checklist
- trip management

Triyyo is NOT primarily a booking platform.

It is a:

"Personalized Travel Decision-Support and Itinerary Optimization Platform."

Core product concept:

Destination
+ Budget
+ Interests
+ Travel Style
+ Duration
+ Location

↓

Personalized Recommendations

↓

Optimized Itinerary

↓

Budget + Map + Trip Management


==================================================
2. PROJECT PURPOSE
==================================================

This is a B.Tech final-year project.

The scope must remain:

- technically meaningful
- visually impressive
- understandable to students
- demonstrable during viva
- realistic for an MVP/V1
- not enterprise-level

Do NOT turn this into a large commercial travel company.

Avoid unnecessary complexity.

==================================================
3. TECHNOLOGY STACK
==================================================

Frontend:

- React.js
- Vite
- Tailwind CSS
- React Router
- Lucide React
- Recharts/Chart.js where useful

Backend:

- Node.js
- Express.js

Database:

- Firebase Firestore

Authentication:

- Firebase Authentication

Storage:

- Firebase Storage if required

Maps:

- Leaflet
- React-Leaflet
- OpenStreetMap-based services

Deployment:

- Vercel

Prefer free-tier services.

Avoid unnecessary paid APIs.

==================================================
4. BRAND
==================================================

Brand:

Triyyo.

The visual identity is:

Premium
Warm
Modern
Travel-focused
Minimal
Consumer-product oriented

Primary orange:

#F97316

Dark orange:

#EA580C

Warm cream:

#FFFDF9

Soft orange:

#FFF1E6

Dark navy:

#172033

Muted:

#64748B

White:

#FFFFFF

Border:

#E7E5E4

Orange should be used selectively.

Do not make the entire interface orange.

==================================================
5. DESIGN LANGUAGE
==================================================

The design should feel like a premium consumer travel product.

Use:

- editorial travel photography
- warm cream backgrounds
- dark navy typography
- orange CTA accents
- generous whitespace
- subtle shadows
- restrained borders
- consistent corner radii
- strong typography hierarchy

Avoid:

- generic SaaS appearance
- excessive gradients
- excessive glassmorphism
- excessive animations
- excessive cards
- unnecessary decorative elements
- enterprise dashboard styling
- overly complicated UI

Premium = restraint + hierarchy + consistency.


==================================================
6. LANDING PAGE
==================================================

The landing page has been visually refined and should NOT be repeatedly redesigned.

Current approved structure:

Navbar
↓
Cinematic Hero
↓
Trip Planner
↓
Handpicked Destinations
↓
How Triyyo Works
↓
CTA
↓
Footer


==================================================
7. LANDING PAGE NAVBAR
==================================================

Logo:

Triyyo.

Navigation:

Destinations
My Trips
Favorites

Authentication:

Log in
Sign up

Keep the navbar minimal.

==================================================
8. LANDING PAGE HERO
==================================================

Hero headline:

Plan Smarter.
Travel Better.

"Plan Smarter." = dark navy

"Travel Better." = orange

Hero description:

Your destination, budget and interests —
turned into a trip that fits you.

Primary CTA:

Plan My Trip →

Secondary:

Explore Destinations

Hero badge:

Personalized trips, built for you

The hero uses a cinematic travel background image.

IMPORTANT:

The hero image is NOT displayed as a fixed rectangular image card.

The image extends across the hero.

The left side has a subtle cream/white overlay so text can sit naturally over the image.

The right side contains stronger travel photography.

The current hero image asset is:

public/images/hero-travel.jpg

Do not replace it unless explicitly requested.


==================================================
9. HERO MATCH CARD
==================================================

The hero contains:

96% Match
Baga Beach, Goa
Perfect for you

This represents the recommendation engine.

IMPORTANT:

Image and text must always correspond.

Never display a destination name that contradicts the displayed image.


==================================================
10. HERO STATISTICS
==================================================

Current stats:

5
Curated destinations

100+
Places to explore

5-factor
Recommendation engine

Desktop:
one horizontal row.

Do not add unnecessary statistics.


==================================================
11. HERO PLANNER
==================================================

The planner is the main interactive product element.

Fields:

Where do you want to go?

Travel dates

Travelers

Budget (₹)

Search button

Example:

e.g. Goa, Manali, Kerala

dd-mm-yyyy

2 Travelers

30000

Only ONE calendar icon should appear in the date field.

The planner should feel like a smart trip-planning bar, not a large form.


==================================================
12. HANDPICKED DESTINATIONS
==================================================

Section:

HANDPICKED FOR YOU

Handpicked destinations

View all destinations →

Destination cards should use strong travel photography.

Example destinations:

Manali
Bali
Jaipur
Munnar


==================================================
13. HOW TRIYYO WORKS
==================================================

Current four-step concept:

1. Choose your destination
2. Tell us your preferences
3. Get personalized recommendations
4. Generate your itinerary

The explanation should communicate the actual product workflow.

Recommendation engine and itinerary generation are the technical core.


==================================================
14. CTA SECTION
==================================================

CTA concept:

Your next adventure starts here.

Tell us where, when and how much — Triyyo handles the rest.

Primary:

Plan My Trip →

Secondary:

Browse Destinations

Supporting features:

Budget-aware plans
Distance-aware routing
Editable itineraries

Keep this section visually premium and simple.


==================================================
15. FOOTER
==================================================

Footer has:

Brand
Explore
Account
Popular destinations

Explore:

Destinations
Plan a trip
Favorites
How it works

Account:

Log in
Sign up
My trips
Dashboard

Popular destinations:

Goa
Hyderabad
Jaipur
Manali
Kerala

Newsletter:

Get travel inspiration & updates

Be the first to know when new destinations and features land.

Email input
Subscribe →

Bottom:

© 2026 Triyyo. Built as a student project.

Privacy Policy
Terms of Service

Made with ♥ for travelers

Footer should remain minimal and premium.


==================================================
16. USER HOME / DASHBOARD
==================================================

The authenticated user home is a personal travel command center.

Header:

Good afternoon, traveler

Ready for your next adventure?

Buttons:

Plan a new trip
Explore destinations


==================================================
17. DASHBOARD SUMMARY CARDS
==================================================

There should be four summary cards:

Upcoming trips
Budget planned
Wishlist
Canceled trips

Example:

2
Upcoming trips

₹40,000
Budget planned

0
Wishlist

0
Canceled trips

These values MUST come from actual user data.

Do not hardcode values.

Upcoming trips:
count planned/upcoming trips.

Budget planned:
sum budgets of upcoming/planned trips.

Wishlist:
count saved/favorite places or destinations.

Canceled trips:
count trips with canceled status.


==================================================
18. DASHBOARD UPCOMING TRIP
==================================================

Section:

Up next

Show the primary upcoming trip as a featured card.

Example:

HYDERABAD

2026-09-07 – 2026-09-08
₹20,000 budget
2 days

Planned
Starts tomorrow

View Trip →


==================================================
19. OTHER UPCOMING TRIPS
==================================================

Show smaller trip cards for other upcoming trips.

Example:

GOA
MANALI
JAIPUR

Use destination photography.

==================================================
20. WISHLIST / FAVORITES
==================================================

Wishlist should use the existing Favorites functionality.

Do NOT create a completely separate unrelated wishlist system if Favorites already exists.

The dashboard Wishlist card should summarize saved places/destinations.

Clicking it can navigate to Favorites.


==================================================
21. CANCELED TRIPS
==================================================

Canceled trips should NOT appear in "Up next".

Only planned/upcoming trips belong there.

Canceled trips should be visible through My Trips or an appropriate filtered trip view.

Dashboard only needs to show the count.


==================================================
22. RECOMMENDATION ENGINE
==================================================

This is one of the most important technical components.

Use transparent weighted scoring.

Final Score:

Preference Match      35%
Distance               20%
Budget Compatibility  20%
Popularity             15%
Rating                 10%

Normalize result to:

0–100


==================================================
23. PREFERENCE MATCH
==================================================

Use user-selected interests/tags.

Examples:

Nature
Beach
Adventure
Culture
Food
Nightlife
Shopping
History
Relaxation

Travel style and traveler type can influence results.

Family:
family-friendly

Couple:
romantic/scenic

Friends:
adventure/nightlife

Solo:
affordable/flexible


==================================================
24. DISTANCE SCORE
==================================================

Example:

0–3 km:
100

3–7 km:
80

7–15 km:
60

15–30 km:
40

30+ km:
20

Distance can be calculated from accommodation/hotel or trip base location.


==================================================
25. BUDGET SCORE
==================================================

Compare estimated place cost against the remaining trip budget.

The system should prioritize options that fit the user's budget.

Do not simply recommend the most expensive/highest-rated places.


==================================================
26. POPULARITY
==================================================

Popularity can use seeded values such as:

- rating
- review count
- saves
- itinerary additions
- popularityScore

For V1, seeded/curated data is acceptable.

Do not build a global real-time popularity pipeline.


==================================================
27. RATING
==================================================

Use normalized rating values.

Example:

4.8/5
→ approximately 96/100


==================================================
28. ITINERARY GENERATION
==================================================

Itinerary generation should use practical heuristics.

Inputs:

destination
dates
days
budget
hotel
preferences
recommended places
opening hours
visit duration
distance

Process:

1. Get recommendations
2. Remove unsuitable places
3. Group geographically nearby places
4. Check opening hours
5. Allocate places to days
6. Create time slots
7. Estimate travel time
8. Estimate costs
9. Check daily budget
10. Generate itinerary

Do NOT implement complex mathematical optimization unless required.

Simple heuristics are sufficient for V1.


==================================================
29. ITINERARY EXAMPLE
==================================================

Example:

Day 1 — North Goa

09:00 Breakfast
10:00 Baga Beach
12:30 Lunch
14:00 Fort Aguada
17:00 Sinquerim Beach
19:30 Dinner

Show:

estimated cost
distance
duration

Allow:

add
remove
reorder
change time
change day
regenerate


==================================================
30. BUDGET OPTIMIZATION
==================================================

Budget categories:

Accommodation
Transportation
Food
Activities
Shopping
Miscellaneous

Show:

Estimated
Actual
Remaining

Include:

Optimize Budget

If the trip exceeds budget:

- identify expensive low-priority places
- find cheaper nearby alternatives
- recalculate totals

Example:

₹25,500

↓

Optimized:

₹19,200


==================================================
31. MAPS
==================================================

Maps must be functional.

Use:

Leaflet
React-Leaflet
OpenStreetMap

Show:

hotel
attractions
restaurants
cafes
activities
itinerary locations

Marker popup:

name
rating
category
distance
estimated cost
view details
add to trip

Filters:

Attractions
Hotels
Restaurants
Cafes
Activities
My itinerary

Routing should show approximate:

distance
travel time

Do not make maps decorative only.


==================================================
32. DATA STRATEGY
==================================================

Do NOT build a global travel database.

Use curated seeded destinations.

Suggested:

Goa
Hyderabad
Jaipur
Delhi
Mumbai
Bengaluru
Manali
Kerala

Approximately:

30–50 places per destination.

Example:

10–15 attractions
5 hotels
5 restaurants
5 cafes
5 activities


==================================================
33. FIRESTORE COLLECTIONS
==================================================

users
destinations
places
trips
itineraries
favorites
checklists
notifications
reviews

Avoid unnecessary collections.


==================================================
34. PLACE DATA
==================================================

Typical fields:

destinationId
name
type
category
description
latitude
longitude
rating
reviewCount
estimatedCost
visitDuration
openingTime
closingTime
popularityScore
tags
images
address
priceLevel
suitableFor


==================================================
35. TRIP DATA
==================================================

Typical:

userId
destinationId
name
startDate
endDate
travelers
budget
hotelId
travelStyle
preferences
status


==================================================
36. ITINERARY DATA
==================================================

Typical:

tripId
day
date

activities:

placeId
startTime
endTime
estimatedCost
distance

Also:

totalDistance
estimatedCost


==================================================
37. API STRUCTURE
==================================================

Typical endpoints:

GET /api/destinations

GET /api/destinations/:id

GET /api/destinations/:id/places

GET /api/places/:id

POST /api/trips

GET /api/trips/:id

PUT /api/trips/:id

DELETE /api/trips/:id

POST /api/recommendations

POST /api/itineraries/generate

PUT /api/itineraries/:id

POST /api/favorites

DELETE /api/favorites/:id

GET /api/admin/stats


==================================================
38. BACKEND STRUCTURE
==================================================

server/

controllers/
routes/
services/
middleware/
config/
utils/

Important services:

recommendationService
itineraryService
routingService
geocodingService


==================================================
39. FRONTEND STRUCTURE
==================================================

src/

components/
pages/
layouts/
services/
hooks/
context/
utils/
data/
routes/


==================================================
40. USER ROLES
==================================================

Only:

Traveler
Admin

Do not add unnecessary roles.


==================================================
41. V1 SCOPE — DO NOT BUILD
==================================================

Do NOT build:

real hotel booking
flight booking
payments
travel insurance
real-time flight tracking
live traffic
real-time GPS
complex machine learning
AI agents
Kafka
Kubernetes
microservices
AWS infrastructure
global POI database
social feed
collaborative editing
global-scale infrastructure

These can be future scope.


==================================================
42. PRODUCT DIFFERENTIATION
==================================================

Do NOT claim that Triyyo is unique because it has:

maps
hotels
restaurants
itineraries
destinations

Existing products already provide many of these.

The core academic/product contribution is:

PERSONALIZED BUDGET-CONSTRAINED ITINERARY OPTIMIZATION.

Triyyo considers simultaneously:

budget
preferences
distance
duration
popularity
ratings
accommodation location

and produces:

ranked recommendations
+
optimized day-wise itinerary.


==================================================
43. IMPORTANT DEVELOPMENT RULE
==================================================

Before modifying an existing feature:

1. Inspect the current implementation.
2. Understand existing components.
3. Reuse working components.
4. Do not duplicate functionality.
5. Do not rewrite working backend logic unnecessarily.
6. Do not break existing routes.
7. Do not replace Firebase unnecessarily.
8. Preserve existing UI decisions unless explicitly asked to change them.


==================================================
44. CURRENT DESIGN STATUS
==================================================

Landing page:
APPROVED

Footer:
APPROVED

User dashboard:
being refined

Do not repeatedly redesign already-approved pages.

When asked for visual improvements, make targeted refinements instead of rebuilding the entire page.


==================================================
45. GENERAL DESIGN RULE
==================================================

Triyyo should look like a real premium travel consumer product.

Not:

a student dashboard
a generic SaaS template
an enterprise management system

The interface should be:

simple
premium
warm
visual
intuitive
consistent


==================================================
46. WHEN MAKING UI CHANGES
==================================================

Always prioritize:

1. visual hierarchy
2. spacing
3. typography
4. consistency
5. usability
6. functionality

Do not add UI merely to make a page look "feature rich".

A simpler polished interface is preferred.


==================================================
47. CURRENT PRIORITY
==================================================

After landing page refinement, focus on the actual product experience:

Plan My Trip
↓
Trip Preferences
↓
Recommendation Results
↓
Itinerary Generation
↓
Budget Optimization
↓
Map / Route
↓
Trip Dashboard

This workflow is more important than further polishing the landing page.