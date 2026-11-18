import { distanceKm, estimateTravelMinutes } from '../utils/geo.js';
import { rankPlaces } from './recommendationEngine.js';

const MAX_PLACES_PER_DAY = 4;
const MEAL_COST_ESTIMATE = 400; // per person, used for breakfast/lunch/dinner slots

const MEAL_SLOTS = [
  { time: '09:00', label: 'Breakfast' },
  { time: '12:30', label: 'Lunch' },
  { time: '19:30', label: 'Dinner' },
];

function addMinutes(time, minutes) {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor((total % (24 * 60)) / 60).toString().padStart(2, '0');
  const mm = (total % 60).toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

function isOpenAt(place, time) {
  if (!place.openingTime || !place.closingTime) return true;
  return time >= place.openingTime && time <= place.closingTime;
}

/**
 * Groups ranked places into geographic clusters using simple nearest-neighbor
 * chaining, so each day's plan stays in one area instead of zig-zagging
 * across the destination. Not a full TSP solve — good enough for a day trip.
 */
function clusterByProximity(scoredPlaces, numDays) {
  const pool = [...scoredPlaces];
  const days = Array.from({ length: numDays }, () => []);
  const perDay = Math.ceil(pool.length / numDays) || 1;

  for (let d = 0; d < numDays && pool.length > 0; d++) {
    // Seed each day with the next highest-scoring unassigned place.
    let current = pool.shift();
    days[d].push(current);

    while (days[d].length < Math.min(perDay, MAX_PLACES_PER_DAY) && pool.length > 0) {
      // Nearest neighbor to the last place added, among remaining candidates.
      let nearestIdx = 0;
      let nearestDist = Infinity;
      pool.forEach((candidate, idx) => {
        const d2 = distanceKm(
          current.place.latitude,
          current.place.longitude,
          candidate.place.latitude,
          candidate.place.longitude
        );
        if (d2 < nearestDist) {
          nearestDist = d2;
          nearestIdx = idx;
        }
      });
      current = pool.splice(nearestIdx, 1)[0];
      days[d].push(current);
    }
  }

  return days;
}

/**
 * Builds a day-wise itinerary from ranked places, allocating time slots,
 * inserting meals, checking opening hours, and totaling cost/distance.
 */
export function generateItinerary({ places, numDays, travelers, hotel, interests, groupType, budget }) {
  const dailyBudgetPerPerson = budget && travelers ? budget / travelers / numDays : null;

  const context = {
    interests,
    groupType,
    hotelLat: hotel?.latitude,
    hotelLng: hotel?.longitude,
    remainingBudgetPerPerson: dailyBudgetPerPerson,
  };

  const scored = rankPlaces(
    places.filter((p) => p.type !== 'hotel'),
    context
  );

  const dayGroups = clusterByProximity(scored, numDays);

  return dayGroups.map((dayPlaces, index) => {
    let time = '10:00';
    let lastLocation = hotel ? { latitude: hotel.latitude, longitude: hotel.longitude } : null;
    let totalCost = 0;
    let totalDistanceKm = 0;
    const activities = [];

    activities.push({ time: '09:00', type: 'meal', label: 'Breakfast', estimatedCost: MEAL_COST_ESTIMATE });
    totalCost += MEAL_COST_ESTIMATE;

    dayPlaces.forEach((scoredPlace, idx) => {
      const { place } = scoredPlace;

      if (lastLocation) {
        const km = distanceKm(lastLocation.latitude, lastLocation.longitude, place.latitude, place.longitude);
        totalDistanceKm += km;
        time = addMinutes(time, estimateTravelMinutes(km));
      }

      if (!isOpenAt(place, time)) {
        time = place.openingTime || time;
      }

      activities.push({
        time,
        type: 'place',
        placeId: place.id,
        name: place.name,
        category: place.category,
        visitDuration: place.visitDuration,
        estimatedCost: place.estimatedCost || 0,
        matchPercent: scoredPlace.matchPercent,
      });
      totalCost += place.estimatedCost || 0;
      time = addMinutes(time, place.visitDuration || 90);
      lastLocation = { latitude: place.latitude, longitude: place.longitude };

      // Insert lunch after the first stop past midday.
      if (idx === 0 && time >= '12:00' && time < '15:00') {
        activities.push({ time, type: 'meal', label: 'Lunch', estimatedCost: MEAL_COST_ESTIMATE });
        totalCost += MEAL_COST_ESTIMATE;
        time = addMinutes(time, 60);
      }
    });

    activities.push({ time: '19:30', type: 'meal', label: 'Dinner', estimatedCost: MEAL_COST_ESTIMATE });
    totalCost += MEAL_COST_ESTIMATE;

    return {
      day: index + 1,
      title: dayPlaces[0]?.place.category ? `Day ${index + 1} — ${dayPlaces[0].place.category}` : `Day ${index + 1}`,
      activities,
      estimatedCost: totalCost * travelers,
      distanceKm: Math.round(totalDistanceKm * 10) / 10,
      overBudget: dailyBudgetPerPerson ? totalCost > dailyBudgetPerPerson : false,
    };
  });
}
