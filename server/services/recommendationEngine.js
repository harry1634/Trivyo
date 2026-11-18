import { WEIGHTS, DISTANCE_BANDS, GROUP_TYPE_BOOST_TAGS } from '../config/recommendationWeights.js';
import { distanceKm } from '../utils/geo.js';

// ---- Individual factor scores (all normalized to 0-100) ----------------

// Overlap between the traveler's chosen interests and a place's tags,
// with a small boost for tags that suit their group type (family/couple/etc).
function preferenceScore(place, interests, groupType) {
  const tags = place.tags || [];
  if (interests.length === 0) return 50; // neutral if user gave no interests

  const matches = interests.filter((interest) =>
    tags.some((tag) => tag.toLowerCase() === interest.toLowerCase())
  ).length;
  let score = (matches / interests.length) * 100;

  const boostTags = GROUP_TYPE_BOOST_TAGS[groupType] || [];
  const boostMatches = boostTags.filter((tag) => tags.includes(tag)).length;
  score += boostMatches * 5; // small nudge, doesn't dominate the score

  return Math.min(100, Math.round(score));
}

// Closer places score higher, but distance never zeroes a place out —
// a must-see landmark 20km away can still surface if it wins on other factors.
function distanceScore(place, hotelLat, hotelLng) {
  if (hotelLat == null || hotelLng == null) return 60; // neutral if no hotel set yet
  const km = distanceKm(hotelLat, hotelLng, place.latitude, place.longitude);
  const band = DISTANCE_BANDS.find((b) => km <= b.maxKm);
  return band.score;
}

// Compares the place's estimated cost (per person) against the traveler's
// remaining per-person daily budget. Cheaper-than-budget places score highest;
// places that would blow the remaining budget score lowest.
function budgetScore(place, remainingBudgetPerPerson) {
  if (remainingBudgetPerPerson == null || remainingBudgetPerPerson <= 0) return 30;
  const cost = place.estimatedCost || 0;
  if (cost === 0) return 100;

  const ratio = cost / remainingBudgetPerPerson;
  if (ratio <= 0.05) return 100;
  if (ratio <= 0.15) return 85;
  if (ratio <= 0.3) return 65;
  if (ratio <= 0.5) return 40;
  return 15;
}

function popularityScore(place) {
  return Math.min(100, place.popularityScore ?? 50);
}

function ratingScore(place) {
  const rating = place.rating ?? 3.5;
  return Math.min(100, Math.round((rating / 5) * 100));
}

/**
 * Scores a single place for a given trip context.
 * Final Score = preference*35% + distance*20% + budget*20% + popularity*15% + rating*10%
 */
export function scorePlace(place, context) {
  const { interests = [], groupType = 'solo', hotelLat, hotelLng, remainingBudgetPerPerson } = context;

  const pref = preferenceScore(place, interests, groupType);
  const dist = distanceScore(place, hotelLat, hotelLng);
  const budget = budgetScore(place, remainingBudgetPerPerson);
  const popularity = popularityScore(place);
  const rating = ratingScore(place);

  const finalScore =
    pref * WEIGHTS.preference +
    dist * WEIGHTS.distance +
    budget * WEIGHTS.budget +
    popularity * WEIGHTS.popularity +
    rating * WEIGHTS.rating;

  return {
    place,
    matchPercent: Math.round(finalScore),
    breakdown: { preference: pref, distance: dist, budget, popularity, rating },
    distanceKm: hotelLat != null ? Math.round(distanceKm(hotelLat, hotelLng, place.latitude, place.longitude) * 10) / 10 : null,
  };
}

/**
 * Scores and ranks a list of candidate places for a trip, highest match first.
 */
export function rankPlaces(places, context) {
  return places
    .map((place) => scorePlace(place, context))
    .sort((a, b) => b.matchPercent - a.matchPercent);
}

// Assigns a display badge based on how a place scored, for UI use.
export function getBadge(scored) {
  const { place, matchPercent, breakdown } = scored;
  if (matchPercent >= 90) return 'Recommended For You';
  if (place.popularityScore >= 90) return 'Trending';
  if (place.rating >= 4.5) return 'Highly Rated';
  if (breakdown.budget >= 85 && place.estimatedCost > 0) return 'Best Value';
  if (place.popularityScore >= 75) return 'Popular';
  return null;
}
