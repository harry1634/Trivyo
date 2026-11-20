import { auth } from '../config/firebase.js';
import { ApiError } from './errorHandler.js';

// Verifies the Firebase ID token sent as "Authorization: Bearer <token>"
// and attaches the decoded user to req.user.
export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new ApiError(401, 'Missing authentication token');

    const decoded = await auth.verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.code || err.message);
    next(new ApiError(401, `Invalid or expired session (${err.code}: ${String(err.message).slice(0, 220)})`));
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return next(new ApiError(403, 'Admin access required'));
  }
  next();
}
