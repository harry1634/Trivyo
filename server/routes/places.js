import { Router } from 'express';
import { getPlace } from '../controllers/placeController.js';

const router = Router();

router.get('/:id', getPlace);

export default router;
