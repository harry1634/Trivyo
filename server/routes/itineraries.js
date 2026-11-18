import { Router } from 'express';
import { generate, getItinerary, updateItinerary, optimize } from '../controllers/itineraryController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.post('/generate', generate);
router.get('/:id', getItinerary);
router.put('/:id', updateItinerary);
router.post('/:id/optimize', optimize);

export default router;
