const EARTH_RADIUS_KM = 6371;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

// Haversine formula: straight-line distance between two lat/lng points in km.
export function distanceKm(lat1, lng1, lat2, lng2) {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

// Rough travel time estimate for city travel (car/auto), used when a live
// routing API isn't available or fails.
export function estimateTravelMinutes(km) {
  const avgSpeedKmh = 25;
  return Math.max(5, Math.round((km / avgSpeedKmh) * 60));
}
