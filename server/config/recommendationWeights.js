// Single source of truth for the recommendation engine's scoring weights.
// Tune these to change how much each factor influences the final score —
// they must add up to 1 (100%).
export const WEIGHTS = {
  preference: 0.35,
  distance: 0.20,
  budget: 0.20,
  popularity: 0.15,
  rating: 0.10,
};

// Distance bands (km) -> score out of 100. Distance nudges ranking rather
// than gating it outright, so even the "low" band still scores something.
export const DISTANCE_BANDS = [
  { maxKm: 3, score: 100 },
  { maxKm: 7, score: 80 },
  { maxKm: 15, score: 60 },
  { maxKm: 30, score: 40 },
  { maxKm: Infinity, score: 20 },
];

// Which place tags to boost per group type, layered on top of the raw
// interest-tag overlap.
export const GROUP_TYPE_BOOST_TAGS = {
  family: ['family', 'kids', 'safe', 'relaxed'],
  couple: ['romantic', 'scenic', 'sunset', 'photography'],
  friends: ['adventure', 'nightlife', 'entertainment', 'group'],
  solo: ['flexible', 'affordable', 'solo', 'backpacker'],
};
