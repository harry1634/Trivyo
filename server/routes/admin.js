import { Router } from 'express';
import {
  getStats,
  listUsers,
  createDestination,
  updateDestination,
  deleteDestination,
  createPlace,
  updatePlace,
  deletePlace,
} from '../controllers/adminController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/stats', getStats);
router.get('/users', listUsers);

router.post('/destinations', createDestination);
router.put('/destinations/:id', updateDestination);
router.delete('/destinations/:id', deleteDestination);

router.post('/places', createPlace);
router.put('/places/:id', updatePlace);
router.delete('/places/:id', deletePlace);

export default router;
