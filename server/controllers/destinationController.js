import { db } from '../config/firebase.js';
import { ApiError } from '../middleware/errorHandler.js';

export async function listDestinations(req, res, next) {
  try {
    const snapshot = await db.collection('destinations').get();
    const destinations = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(destinations);
  } catch (err) {
    next(err);
  }
}

export async function getDestination(req, res, next) {
  try {
    const doc = await db.collection('destinations').doc(req.params.id).get();
    if (!doc.exists) throw new ApiError(404, 'Destination not found');
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    next(err);
  }
}

export async function getDestinationPlaces(req, res, next) {
  try {
    const snapshot = await db
      .collection('places')
      .where('destinationId', '==', req.params.id)
      .get();
    const places = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(places);
  } catch (err) {
    next(err);
  }
}
