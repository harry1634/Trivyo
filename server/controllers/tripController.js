import { db } from '../config/firebase.js';
import { ApiError } from '../middleware/errorHandler.js';

export async function createTrip(req, res, next) {
  try {
    const trip = {
      ...req.body,
      userId: req.user.uid,
      status: 'planning',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const ref = await db.collection('trips').add(trip);
    res.status(201).json({ id: ref.id, ...trip });
  } catch (err) {
    next(err);
  }
}

export async function listMyTrips(req, res, next) {
  try {
    const snapshot = await db.collection('trips').where('userId', '==', req.user.uid).get();
    res.json(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  } catch (err) {
    next(err);
  }
}

export async function getTrip(req, res, next) {
  try {
    const doc = await db.collection('trips').doc(req.params.id).get();
    if (!doc.exists) throw new ApiError(404, 'Trip not found');
    const trip = doc.data();
    if (trip.userId !== req.user.uid) throw new ApiError(403, 'Not your trip');
    res.json({ id: doc.id, ...trip });
  } catch (err) {
    next(err);
  }
}

export async function updateTrip(req, res, next) {
  try {
    const ref = db.collection('trips').doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) throw new ApiError(404, 'Trip not found');
    if (doc.data().userId !== req.user.uid) throw new ApiError(403, 'Not your trip');

    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    await ref.update(updates);
    res.json({ id: ref.id, ...doc.data(), ...updates });
  } catch (err) {
    next(err);
  }
}

export async function deleteTrip(req, res, next) {
  try {
    const ref = db.collection('trips').doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) throw new ApiError(404, 'Trip not found');
    if (doc.data().userId !== req.user.uid) throw new ApiError(403, 'Not your trip');

    await ref.delete();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
