import { db } from '../config/firebase.js';
import { generateItinerary } from '../services/itineraryGenerator.js';
import { optimizeItinerary } from '../services/budgetOptimizer.js';
import { ApiError } from '../middleware/errorHandler.js';

// POST /api/itineraries/generate
// body: { tripId, destinationId, numDays, travelers, hotel, interests, groupType, budget }
export async function generate(req, res, next) {
  try {
    const { tripId, destinationId, numDays, travelers, hotel, interests = [], groupType = 'balanced', budget } = req.body;
    if (!destinationId || !numDays) throw new ApiError(400, 'destinationId and numDays are required');

    const snapshot = await db.collection('places').where('destinationId', '==', destinationId).get();
    const places = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const days = generateItinerary({ places, numDays, travelers, hotel, interests, groupType, budget });
    const totalCost = days.reduce((sum, d) => sum + d.estimatedCost, 0);

    const itinerary = {
      tripId: tripId || null,
      destinationId,
      days,
      totalCost,
      budget: budget || null,
      overBudget: budget ? totalCost > budget : false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const ref = await db.collection('itineraries').add(itinerary);
    res.status(201).json({ id: ref.id, ...itinerary });
  } catch (err) {
    next(err);
  }
}

export async function getItinerary(req, res, next) {
  try {
    const doc = await db.collection('itineraries').doc(req.params.id).get();
    if (!doc.exists) throw new ApiError(404, 'Itinerary not found');
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    next(err);
  }
}

export async function updateItinerary(req, res, next) {
  try {
    const ref = db.collection('itineraries').doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) throw new ApiError(404, 'Itinerary not found');

    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    await ref.update(updates);
    res.json({ id: ref.id, ...doc.data(), ...updates });
  } catch (err) {
    next(err);
  }
}

// POST /api/itineraries/:id/optimize
export async function optimize(req, res, next) {
  try {
    const ref = db.collection('itineraries').doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) throw new ApiError(404, 'Itinerary not found');
    const itinerary = doc.data();

    const snapshot = await db.collection('places').where('destinationId', '==', itinerary.destinationId).get();
    const places = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    const { interests = [], groupType = 'balanced', hotel } = req.body;
    const context = { interests, groupType, hotelLat: hotel?.latitude, hotelLng: hotel?.longitude };

    const { days, changes, currentTotal } = optimizeItinerary(itinerary.days, places, context, itinerary.budget);

    const updates = {
      days,
      totalCost: currentTotal,
      overBudget: itinerary.budget ? currentTotal > itinerary.budget : false,
      updatedAt: new Date().toISOString(),
    };
    await ref.update(updates);

    res.json({ id: ref.id, ...itinerary, ...updates, changes });
  } catch (err) {
    next(err);
  }
}
