import { db } from '../config/firebase.js';
import { rankPlaces, getBadge } from '../services/recommendationEngine.js';
import { ApiError } from '../middleware/errorHandler.js';

// POST /api/recommendations
// body: { destinationId, interests, groupType, hotel: {latitude,longitude}, budget, travelers, numDays }
export async function getRecommendations(req, res, next) {
  try {
    const { destinationId, interests = [], groupType = 'solo', hotel, budget, travelers = 1, numDays = 1 } = req.body;
    if (!destinationId) throw new ApiError(400, 'destinationId is required');

    const snapshot = await db.collection('places').where('destinationId', '==', destinationId).get();
    const places = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).filter((p) => p.type !== 'hotel');

    const remainingBudgetPerPerson = budget ? budget / travelers / numDays : null;

    const ranked = rankPlaces(places, {
      interests,
      groupType,
      hotelLat: hotel?.latitude,
      hotelLng: hotel?.longitude,
      remainingBudgetPerPerson,
    });

    const results = ranked.map((scored) => ({
      place: scored.place,
      matchPercent: scored.matchPercent,
      distanceKm: scored.distanceKm,
      badge: getBadge(scored),
    }));

    res.json(results);
  } catch (err) {
    next(err);
  }
}
