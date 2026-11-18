import { Router } from 'express';
import { createTrip, listMyTrips, getTrip, updateTrip, deleteTrip } from '../controllers/tripController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.post('/', createTrip);
router.get('/', listMyTrips);
router.get('/:id', getTrip);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);

export default router;
