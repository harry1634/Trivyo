import { db } from '../config/firebase.js';
import { ApiError } from '../middleware/errorHandler.js';

const DEFAULT_CHECKLIST = {
  Documents: [
    { label: 'ID / Passport', checked: false },
    { label: 'Tickets', checked: false },
    { label: 'Hotel confirmation', checked: false },
  ],
  Essentials: [
    { label: 'Charger', checked: false },
    { label: 'Power bank', checked: false },
    { label: 'Clothes', checked: false },
    { label: 'Toiletries', checked: false },
  ],
};

export async function getOrCreateChecklist(req, res, next) {
  try {
    const { tripId } = req.params;
    const snapshot = await db.collection('checklists').where('tripId', '==', tripId).limit(1).get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return res.json({ id: doc.id, ...doc.data() });
    }

    const checklist = { tripId, userId: req.user.uid, categories: DEFAULT_CHECKLIST, createdAt: new Date().toISOString() };
    const ref = await db.collection('checklists').add(checklist);
    res.status(201).json({ id: ref.id, ...checklist });
  } catch (err) {
    next(err);
  }
}

export async function updateChecklist(req, res, next) {
  try {
    const ref = db.collection('checklists').doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) throw new ApiError(404, 'Checklist not found');

    const updates = { categories: req.body.categories, updatedAt: new Date().toISOString() };
    await ref.update(updates);
    res.json({ id: ref.id, ...doc.data(), ...updates });
  } catch (err) {
    next(err);
  }
}
