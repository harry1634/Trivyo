import { distanceKm } from '../utils/geo.js';
import { scorePlace } from './recommendationEngine.js';

/**
 * If a generated itinerary exceeds budget, swap out the lowest-match / highest-cost
 * "place" activities for cheaper nearby alternatives from the candidate pool,
 * cheapest-impact swaps first, until the itinerary fits (or no more swaps help).
 */
export function optimizeItinerary(itineraryDays, allPlaces, context, totalBudget) {
  const placesById = new Map(allPlaces.map((p) => [p.id, p]));
  const usedIds = new Set(
    itineraryDays.flatMap((day) => day.activities.filter((a) => a.type === 'place').map((a) => a.placeId))
  );

  const days = itineraryDays.map((day) => ({ ...day, activities: [...day.activities] }));
  const changes = [];

  let currentTotal = days.reduce((sum, d) => sum + d.estimatedCost, 0);
  if (currentTotal <= totalBudget) return { days, changes, currentTotal };

  // Build swap candidates: place activities sorted worst-value-first
  // (low match score, high cost) so we cut the least useful, priciest items.
  const swapCandidates = [];
  days.forEach((day, dayIdx) => {
    day.activities.forEach((activity, actIdx) => {
      if (activity.type === 'place') {
        swapCandidates.push({ dayIdx, actIdx, activity });
      }
    });
  });
  swapCandidates.sort((a, b) => a.activity.matchPercent - b.activity.matchPercent || b.activity.estimatedCost - a.activity.estimatedCost);

  for (const candidate of swapCandidates) {
    if (currentTotal <= totalBudget) break;

    const { dayIdx, actIdx, activity } = candidate;
    const originalPlace = placesById.get(activity.placeId);
    if (!originalPlace) continue;

    // Prefer a cheaper place in the same category (e.g. swap one beach for another),
    // but fall back to any cheaper, unused place if nothing matches the category —
    // seed data is limited, and a cross-category swap still saves money.
    const sameCategoryAlternatives = allPlaces.filter(
      (p) => !usedIds.has(p.id) && p.type !== 'hotel' && p.category === originalPlace.category && p.estimatedCost < originalPlace.estimatedCost
    );
    const anyAlternatives = allPlaces.filter(
      (p) => !usedIds.has(p.id) && p.type !== 'hotel' && p.estimatedCost < originalPlace.estimatedCost
    );
    const candidatePool = sameCategoryAlternatives.length ? sameCategoryAlternatives : anyAlternatives;

    const alternatives = candidatePool
      .map((p) => scorePlace(p, context))
      .sort((a, b) => b.matchPercent - a.matchPercent);

    const replacement = alternatives[0];
    if (!replacement) continue;

    const savedPerPerson = activity.estimatedCost - (replacement.place.estimatedCost || 0);
    const travelers = 1; // costs stored on activities are already per-trip totals upstream
    const saved = savedPerPerson;

    days[dayIdx].activities[actIdx] = {
      ...activity,
      placeId: replacement.place.id,
      name: replacement.place.name,
      category: replacement.place.category,
      visitDuration: replacement.place.visitDuration,
      estimatedCost: replacement.place.estimatedCost || 0,
      matchPercent: replacement.matchPercent,
    };

    days[dayIdx].estimatedCost -= saved;
    currentTotal -= saved;
    usedIds.add(replacement.place.id);

    changes.push({
      day: days[dayIdx].day,
      removed: originalPlace.name,
      added: replacement.place.name,
      saved,
    });
  }

  // If swapping alone wasn't enough (seed data has limited cheap alternatives),
  // drop the remaining lowest-match place activities outright rather than
  // leaving the itinerary over budget.
  if (currentTotal > totalBudget) {
    const remaining = [];
    days.forEach((day, dayIdx) => {
      day.activities.forEach((activity, actIdx) => {
        if (activity.type === 'place') remaining.push({ dayIdx, actIdx, activity });
      });
    });
    remaining.sort((a, b) => a.activity.matchPercent - b.activity.matchPercent || b.activity.estimatedCost - a.activity.estimatedCost);

    for (const { dayIdx, actIdx, activity } of remaining) {
      if (currentTotal <= totalBudget) break;
      // Keep at least one place activity per day so the itinerary isn't empty.
      const placeCountThisDay = days[dayIdx].activities.filter((a) => a.type === 'place').length;
      if (placeCountThisDay <= 1) continue;

      const originalPlace = placesById.get(activity.placeId);
      days[dayIdx].activities = days[dayIdx].activities.filter((a) => a !== activity);
      days[dayIdx].estimatedCost -= activity.estimatedCost;
      currentTotal -= activity.estimatedCost;

      changes.push({ day: days[dayIdx].day, removed: originalPlace?.name || activity.name, added: null, saved: activity.estimatedCost });
    }
  }

  return { days, changes, currentTotal };
}
