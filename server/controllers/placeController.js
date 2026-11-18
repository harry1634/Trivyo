import { db } from '../config/firebase.js';
import { ApiError } from '../middleware/errorHandler.js';

export async function getPlace(req, res, next) {
  try {
    const doc = await db.collection('places').doc(req.params.id).get();
    if (!doc.exists) throw new ApiError(404, 'Place not found');
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    next(err);
  }
}
