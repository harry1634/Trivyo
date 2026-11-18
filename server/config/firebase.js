import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Uses a service account JSON (base64-encoded in FIREBASE_SERVICE_ACCOUNT_BASE64)
// so the raw JSON never has to live in the repo or a plain env var.
const serviceAccountB64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

if (!serviceAccountB64) {
  console.warn('FIREBASE_SERVICE_ACCOUNT_BASE64 is not set. Firebase Admin will not work until it is configured.');
}

const serviceAccount = serviceAccountB64
  ? JSON.parse(Buffer.from(serviceAccountB64, 'base64').toString('utf-8'))
  : null;

if (serviceAccount && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.apps.length ? admin.firestore() : null;
export const auth = admin.apps.length ? admin.auth() : null;
export default admin;
