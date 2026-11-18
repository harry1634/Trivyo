import { db } from '../config/firebase.js';
import { ApiError } from '../middleware/errorHandler.js';

export async function addFavorite(req, res, next) {
  try {
    const { placeId, destinationId } = req.body;
    if (!placeId && !destinationId) throw new ApiError(400, 'placeId or destinationId is required');

    const favorite = { userId: req.user.uid, placeId: placeId || null, destinationId: destinationId || null, createdAt: new Date().toISOString() };
    const ref = await db.collection('favorites').add(favorite);
    res.status(201).json({ id: ref.id, ...favorite });
  } catch (err) {
    next(err);
  }
}

export async function listFavorites(req, res, next) {
  try {
    const snapshot = await db.collection('favorites').where('userId', '==', req.user.uid).get();
    res.json(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  } catch (err) {
    next(err);
  }
}

export async function removeFavorite(req, res, next) {
  try {
    const ref = db.collection('favorites').doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) throw new ApiError(404, 'Favorite not found');
    if (doc.data().userId !== req.user.uid) throw new ApiError(403, 'Not your favorite');

    await ref.delete();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
