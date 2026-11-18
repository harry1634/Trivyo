import { Router } from 'express';
import { addFavorite, listFavorites, removeFavorite } from '../controllers/favoriteController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.post('/', addFavorite);
router.get('/', listFavorites);
router.delete('/:id', removeFavorite);

export default router;
