import { Router } from 'express';
import { getOrCreateChecklist, updateChecklist } from '../controllers/checklistController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/trip/:tripId', getOrCreateChecklist);
router.put('/:id', updateChecklist);

export default router;
