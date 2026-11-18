// Recomputes a day's displayed cost from its activities — needed after a
// manual edit (removing a place, etc.) since the server-generated cost
// doesn't update itself when the client edits the plan.
export function recalculateDay(day) {
  const estimatedCost = day.activities.reduce((sum, a) => sum + (a.estimatedCost || 0), 0);
  return { ...day, estimatedCost };
}

export function recalculateItinerary(days, budget) {
  const updatedDays = days.map(recalculateDay);
  const totalCost = updatedDays.reduce((sum, d) => sum + d.estimatedCost, 0);
  return { days: updatedDays, totalCost, overBudget: budget ? totalCost > budget : false };
}

export const BUDGET_CATEGORIES = ['Accommodation', 'Food', 'Activities', 'Shopping', 'Miscellaneous'];

// Maps a place's category (from the seed data — 'biryani', 'hostel', 'market', etc.)
// to the broader budget bucket it belongs under. Meals are always Food.
const CATEGORY_TO_BUDGET_BUCKET = {
  hostel: 'Accommodation', boutique: 'Accommodation', 'mid-range': 'Accommodation',
  resort: 'Accommodation', luxury: 'Accommodation', homestay: 'Accommodation', business: 'Accommodation',
  biryani: 'Food', seafood: 'Food', local: 'Food', 'south-indian': 'Food',
  'cultural-dining': 'Food', 'fine-dining': 'Food', 'multi-cuisine': 'Food',
  coffee: 'Food', tea: 'Food', dessert: 'Food', organic: 'Food', rooftop: 'Food', lounge: 'Food', 'beach-cafe': 'Food',
  market: 'Shopping',
};

// Builds the estimated cost per budget category from the generated itinerary
// (activities + meals) plus accommodation, which the itinerary itself never
// included since it only totals activities/meals, not the stay.
export function computeBudgetBreakdown({ itinerary, trip, places }) {
  const breakdown = { Accommodation: 0, Food: 0, Activities: 0, Shopping: 0, Miscellaneous: 0 };
  const travelers = trip.travelers || 1;

  itinerary.days.forEach((day) => {
    day.activities.forEach((activity) => {
      const bucket = activity.type === 'meal' ? 'Food' : CATEGORY_TO_BUDGET_BUCKET[activity.category] || 'Activities';
      breakdown[bucket] += (activity.estimatedCost || 0) * travelers;
    });
  });

  const hotelPlace = places.find((p) => p.id === trip.hotel?.id);
  if (hotelPlace) {
    breakdown.Accommodation += (hotelPlace.estimatedCost || 0) * (trip.numDays || 1);
  }

  return breakdown;
}
