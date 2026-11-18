import { db } from '../config/firebase.js';
import { destinations } from './destinations.js';
import { places } from './places.js';

async function seed() {
  if (!db) {
    console.error('Firestore is not initialized. Set FIREBASE_SERVICE_ACCOUNT_BASE64 in server/.env first.');
    process.exit(1);
  }

  console.log(`Seeding ${destinations.length} destinations...`);
  for (const destination of destinations) {
    const { id, ...data } = destination;
    await db.collection('destinations').doc(id).set(data);
  }

  console.log(`Seeding ${places.length} places...`);
  let batch = db.batch();
  let count = 0;
  for (const p of places) {
    const { id, ...data } = p;
    const ref = db.collection('places').doc(id);
    batch.set(ref, data);
    count++;
    if (count % 400 === 0) {
      await batch.commit();
      batch = db.batch();
    }
  }
  await batch.commit();

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
