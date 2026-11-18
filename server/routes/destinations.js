import { Router } from 'express';
import { listDestinations, getDestination, getDestinationPlaces } from '../controllers/destinationController.js';

const router = Router();

router.get('/', listDestinations);
router.get('/:id', getDestination);
router.get('/:id/places', getDestinationPlaces);

export default router;
