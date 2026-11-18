import { db } from '../config/firebase.js';
import { ApiError } from '../middleware/errorHandler.js';

export async function getStats(req, res, next) {
  try {
    const [users, destinations, places, trips, itineraries] = await Promise.all([
      db.collection('users').count().get(),
      db.collection('destinations').count().get(),
      db.collection('places').count().get(),
      db.collection('trips').count().get(),
      db.collection('itineraries').count().get(),
    ]);

    res.json({
      totalUsers: users.data().count,
      totalDestinations: destinations.data().count,
      totalPlaces: places.data().count,
      totalTrips: trips.data().count,
      totalItineraries: itineraries.data().count,
    });
  } catch (err) {
    next(err);
  }
}

export async function listUsers(req, res, next) {
  try {
    const snapshot = await db.collection('users').get();
    res.json(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  } catch (err) {
    next(err);
  }
}

export async function createDestination(req, res, next) {
  try {
    const destination = { ...req.body, createdAt: new Date().toISOString() };
    const ref = await db.collection('destinations').add(destination);
    res.status(201).json({ id: ref.id, ...destination });
  } catch (err) {
    next(err);
  }
}

export async function updateDestination(req, res, next) {
  try {
    const ref = db.collection('destinations').doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) throw new ApiError(404, 'Destination not found');
    await ref.update(req.body);
    res.json({ id: ref.id, ...doc.data(), ...req.body });
  } catch (err) {
    next(err);
  }
}

export async function deleteDestination(req, res, next) {
  try {
    await db.collection('destinations').doc(req.params.id).delete();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function createPlace(req, res, next) {
  try {
    const place = { ...req.body, createdAt: new Date().toISOString() };
    const ref = await db.collection('places').add(place);
    res.status(201).json({ id: ref.id, ...place });
  } catch (err) {
    next(err);
  }
}

export async function updatePlace(req, res, next) {
  try {
    const ref = db.collection('places').doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) throw new ApiError(404, 'Place not found');
    await ref.update(req.body);
    res.json({ id: ref.id, ...doc.data(), ...req.body });
  } catch (err) {
    next(err);
  }
}

export async function deletePlace(req, res, next) {
  try {
    await db.collection('places').doc(req.params.id).delete();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
