import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import destinationRoutes from './routes/destinations.js';
import placeRoutes from './routes/places.js';
import tripRoutes from './routes/trips.js';
import recommendationRoutes from './routes/recommendations.js';
import itineraryRoutes from './routes/itineraries.js';
import favoriteRoutes from './routes/favorites.js';
import checklistRoutes from './routes/checklists.js';
import adminRoutes from './routes/admin.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/destinations', destinationRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/checklists', checklistRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Trivyo server running on port ${PORT}`));
