// Realistic seed data for the recommendation engine to have enough
// candidates per destination. Coordinates are approximate real-world values.

// Every place used to fall back to one single hardcoded default image, and
// then (once fixed) one image per *category* — meaning every heritage site
// in Jaipur still showed the same photo. Each bucket below now holds several
// verified images; places cycle through their bucket in seeding order so
// consecutive same-category places don't repeat.
const IMAGE_BUCKETS = {
  heritage: [
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800', // Taj Mahal
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', // Hawa Mahal, street view
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', // India Gate
    'https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?w=800', // Hawa Mahal, close-up
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=800', // Taj Mahal through archway
  ],
  nature: [
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', // Himalayan valley (Manali)
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', // Mountain range at sunset
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', // Forest path
  ],
  beach: [
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', // Goa palm-fringed beach
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800', // Tropical beach with sailboat
    'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800', // Beach at sunset
  ],
  water: [
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', // Kerala backwaters houseboat
  ],
  hotel: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', // Overwater resort deck
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', // Poolside resort at night
  ],
  budgetStay: [
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', // Hostel bunk room
  ],
  restaurant: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', // Restaurant interior
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', // Fine-dining plate
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', // Waterside restaurant terrace
  ],
  biryani: [
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', // Actual biryani dish
  ],
  cafe: [
    'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800', // Cozy cafe table
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800', // Coffee cups with latte art
  ],
  market: [
    'https://images.unsplash.com/photo-1555529771-835f59fc5efe?w=800', // Clothing/shopping racks
  ],
  entertainment: [
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800', // Lively evening gathering
  ],
};

// Which category maps to which bucket above.
const CATEGORY_TO_BUCKET = {
  heritage: 'heritage', temple: 'heritage', museum: 'heritage',
  nature: 'nature', wildlife: 'nature', village: 'nature', adventure: 'nature',
  beach: 'beach', 'beach-cafe': 'beach',
  'water-sports': 'water', boating: 'water', cruise: 'water',
  hostel: 'budgetStay',
  boutique: 'hotel', 'mid-range': 'hotel', resort: 'hotel', luxury: 'hotel', homestay: 'hotel', business: 'hotel',
  biryani: 'biryani',
  seafood: 'restaurant', local: 'restaurant', 'south-indian': 'restaurant',
  'cultural-dining': 'restaurant', 'fine-dining': 'restaurant', 'multi-cuisine': 'restaurant',
  coffee: 'cafe', tea: 'cafe', dessert: 'cafe', organic: 'cafe', rooftop: 'cafe', lounge: 'cafe',
  market: 'market',
  entertainment: 'entertainment', 'cultural-show': 'entertainment', wellness: 'entertainment',
};
const DEFAULT_IMAGE = IMAGE_BUCKETS.heritage[0];

// Tracks how many times each bucket has been used, so repeated categories
// (e.g. 14 heritage places) cycle through that bucket's images in order
// instead of all landing on the first one.
const bucketUsage = {};
function pickImage(category) {
  const bucketName = CATEGORY_TO_BUCKET[category];
  const bucket = IMAGE_BUCKETS[bucketName];
  if (!bucket) return DEFAULT_IMAGE;
  const index = bucketUsage[bucketName] || 0;
  bucketUsage[bucketName] = index + 1;
  return bucket[index % bucket.length];
}

let nextId = 1;
function place(destinationId, overrides) {
  return {
    id: `${destinationId}-${nextId++}`,
    destinationId,
    reviewCount: 500,
    priceLevel: 2,
    suitableFor: ['solo', 'couple', 'family', 'friends'],
    openingTime: '09:00',
    closingTime: '19:00',
    image: pickImage(overrides.category),
    address: '',
    ...overrides,
  };
}

export const places = [
  // ---------------- GOA ----------------
  place('goa', { name: 'Baga Beach', type: 'attraction', category: 'beach', rating: 4.5, reviewCount: 12500, estimatedCost: 0, visitDuration: 120, popularityScore: 95, tags: ['beach', 'photography', 'family', 'friends', 'nightlife'], latitude: 15.5553, longitude: 73.7517, openingTime: '06:00', closingTime: '22:00' }),
  place('goa', { name: 'Calangute Beach', type: 'attraction', category: 'beach', rating: 4.3, reviewCount: 15000, estimatedCost: 0, visitDuration: 120, popularityScore: 92, tags: ['beach', 'family', 'photography'], latitude: 15.5439, longitude: 73.7553, openingTime: '06:00', closingTime: '22:00' }),
  place('goa', { name: 'Fort Aguada', type: 'attraction', category: 'heritage', rating: 4.4, reviewCount: 8000, estimatedCost: 50, visitDuration: 90, popularityScore: 85, tags: ['history', 'photography', 'sunset', 'scenic'], latitude: 15.4925, longitude: 73.7738, image: 'https://images.unsplash.com/photo-1694931537785-ca96d985b52c?w=800' }),
  place('goa', { name: 'Basilica of Bom Jesus', type: 'attraction', category: 'heritage', rating: 4.6, reviewCount: 9500, estimatedCost: 0, visitDuration: 60, popularityScore: 88, tags: ['history', 'culture', 'photography'], latitude: 15.5009, longitude: 73.9114, image: 'https://images.unsplash.com/photo-1768728678060-598c3b983b3f?w=800' }),
  place('goa', { name: 'Fontainhas (Latin Quarter)', type: 'attraction', category: 'heritage', rating: 4.5, reviewCount: 4000, estimatedCost: 0, visitDuration: 90, popularityScore: 78, tags: ['culture', 'photography', 'history'], latitude: 15.4968, longitude: 73.8299, image: 'https://images.unsplash.com/photo-1656155316674-d8fab9e65eab?w=800' }),
  place('goa', { name: 'Anjuna Flea Market', type: 'shopping', category: 'market', rating: 4.2, reviewCount: 6000, estimatedCost: 500, visitDuration: 120, popularityScore: 80, tags: ['shopping', 'culture', 'friends'], latitude: 15.5738, longitude: 73.7411, openingTime: '10:00', closingTime: '20:00', image: 'https://images.unsplash.com/photo-1783070185188-ee2a182c883d?w=800' }),
  place('goa', { name: 'Dudhsagar Falls', type: 'attraction', category: 'nature', rating: 4.6, reviewCount: 7000, estimatedCost: 400, visitDuration: 180, popularityScore: 82, tags: ['nature', 'adventure', 'photography'], latitude: 15.3144, longitude: 74.3144, image: 'https://images.unsplash.com/photo-1786267081749-151f970b8eb3?w=800' }),
  place('goa', { name: 'Sinquerim Beach', type: 'attraction', category: 'beach', rating: 4.3, reviewCount: 3500, estimatedCost: 0, visitDuration: 90, popularityScore: 74, tags: ['beach', 'scenic', 'romantic'], latitude: 15.4977, longitude: 73.7683 },),
  place('goa', { name: 'Chapora Fort', type: 'attraction', category: 'heritage', rating: 4.2, reviewCount: 5000, estimatedCost: 0, visitDuration: 60, popularityScore: 75, tags: ['history', 'sunset', 'photography', 'romantic'], latitude: 15.6053, longitude: 73.7358, image: 'https://images.unsplash.com/photo-1736961453451-0a3640498a37?w=800' }),
  place('goa', { name: 'Palolem Beach', type: 'attraction', category: 'beach', rating: 4.7, reviewCount: 9000, estimatedCost: 0, visitDuration: 150, popularityScore: 89, tags: ['beach', 'scenic', 'romantic', 'relaxed'], latitude: 15.0100, longitude: 74.0233 }),

  place('goa', { name: 'Taj Fort Aguada Resort', type: 'hotel', category: 'resort', rating: 4.6, estimatedCost: 12000, visitDuration: 0, popularityScore: 90, tags: ['luxury', 'family', 'romantic'], latitude: 15.4930, longitude: 73.7720, priceLevel: 4 }),
  place('goa', { name: 'Hotel Calangute Towers', type: 'hotel', category: 'mid-range', rating: 4.1, estimatedCost: 4500, visitDuration: 0, popularityScore: 75, tags: ['family', 'affordable'], latitude: 15.5450, longitude: 73.7560, priceLevel: 2 }),
  place('goa', { name: 'Zostel Goa', type: 'hotel', category: 'hostel', rating: 4.3, estimatedCost: 1200, visitDuration: 0, popularityScore: 82, tags: ['backpacker', 'solo', 'affordable', 'friends'], latitude: 15.5700, longitude: 73.7450, priceLevel: 1 }),
  place('goa', { name: 'Baga Beach Resort', type: 'hotel', category: 'resort', rating: 4.2, estimatedCost: 6000, visitDuration: 0, popularityScore: 80, tags: ['beach', 'family', 'romantic'], latitude: 15.5560, longitude: 73.7530, priceLevel: 3 }),
  place('goa', { name: 'Casa Sea Shell', type: 'hotel', category: 'boutique', rating: 4.4, estimatedCost: 3500, visitDuration: 0, popularityScore: 76, tags: ['romantic', 'boutique', 'couple'], latitude: 15.5480, longitude: 73.7500, priceLevel: 2 }),

  place('goa', { name: 'Fisherman\'s Wharf', type: 'restaurant', category: 'seafood', rating: 4.5, estimatedCost: 800, visitDuration: 75, popularityScore: 88, tags: ['food', 'romantic', 'scenic'], latitude: 15.5300, longitude: 73.7900 }),
  place('goa', { name: 'Curlies Beach Shack', type: 'restaurant', category: 'seafood', rating: 4.2, estimatedCost: 600, visitDuration: 75, popularityScore: 82, tags: ['food', 'nightlife', 'beach', 'friends'], latitude: 15.5750, longitude: 73.7400 }),
  place('goa', { name: 'Vinayak Family Restaurant', type: 'restaurant', category: 'local', rating: 4.4, estimatedCost: 400, visitDuration: 60, popularityScore: 79, tags: ['food', 'affordable', 'family'], latitude: 15.5440, longitude: 73.7560 }),
  place('goa', { name: 'Gunpowder', type: 'restaurant', category: 'south-indian', rating: 4.6, estimatedCost: 900, visitDuration: 75, popularityScore: 85, tags: ['food', 'romantic'], latitude: 15.5730, longitude: 73.7420 }),
  place('goa', { name: 'Martin\'s Corner', type: 'restaurant', category: 'seafood', rating: 4.5, estimatedCost: 1000, visitDuration: 75, popularityScore: 84, tags: ['food', 'family'], latitude: 15.3480, longitude: 73.9160 }),

  place('goa', { name: 'Cafe Chocolatti', type: 'cafe', category: 'dessert', rating: 4.4, estimatedCost: 350, visitDuration: 45, popularityScore: 78, tags: ['food', 'romantic', 'photography'], latitude: 15.5470, longitude: 73.7510 }),
  place('goa', { name: 'Artjuna Cafe', type: 'cafe', category: 'organic', rating: 4.5, estimatedCost: 400, visitDuration: 45, popularityScore: 76, tags: ['food', 'solo', 'relaxed'], latitude: 15.5740, longitude: 73.7405 }),
  place('goa', { name: 'Mojo Beach Cafe', type: 'cafe', category: 'beach-cafe', rating: 4.3, estimatedCost: 450, visitDuration: 60, popularityScore: 77, tags: ['beach', 'photography', 'friends'], latitude: 15.5560, longitude: 73.7520 }),

  place('goa', { name: 'Scuba Diving at Grande Island', type: 'activity', category: 'water-sports', rating: 4.6, estimatedCost: 3500, visitDuration: 180, popularityScore: 84, tags: ['adventure', 'friends', 'photography'], latitude: 15.4600, longitude: 73.8010 }),
  place('goa', { name: 'Sunset River Cruise', type: 'activity', category: 'cruise', rating: 4.4, estimatedCost: 700, visitDuration: 90, popularityScore: 80, tags: ['romantic', 'scenic', 'sunset'], latitude: 15.4990, longitude: 73.8280 }),
  place('goa', { name: 'Parasailing at Baga', type: 'activity', category: 'water-sports', rating: 4.3, estimatedCost: 1500, visitDuration: 30, popularityScore: 79, tags: ['adventure', 'friends'], latitude: 15.5560, longitude: 73.7525 }),

  // ---------------- HYDERABAD ----------------
  place('hyderabad', { name: 'Charminar', type: 'attraction', category: 'heritage', rating: 4.5, reviewCount: 20000, estimatedCost: 25, visitDuration: 90, popularityScore: 96, tags: ['history', 'culture', 'photography'], latitude: 17.3616, longitude: 78.4747, image: 'https://images.unsplash.com/photo-1696941515998-d83f24967aca?w=800' }),
  place('hyderabad', { name: 'Golconda Fort', type: 'attraction', category: 'heritage', rating: 4.5, reviewCount: 14000, estimatedCost: 25, visitDuration: 120, popularityScore: 90, tags: ['history', 'photography', 'sunset'], latitude: 17.3833, longitude: 78.4011, image: 'https://images.unsplash.com/photo-1568484085354-4e6149a3e658?w=800' }),
  place('hyderabad', { name: 'Ramoji Film City', type: 'attraction', category: 'entertainment', rating: 4.4, reviewCount: 18000, estimatedCost: 1200, visitDuration: 360, popularityScore: 88, tags: ['entertainment', 'family', 'photography'], latitude: 17.2543, longitude: 78.6808 }),
  place('hyderabad', { name: 'Hussain Sagar Lake', type: 'attraction', category: 'nature', rating: 4.3, reviewCount: 9000, estimatedCost: 0, visitDuration: 90, popularityScore: 82, tags: ['scenic', 'romantic', 'family'], latitude: 17.4239, longitude: 78.4738, image: 'https://images.unsplash.com/photo-1712422813106-dfb845a8a7ed?w=800' }),
  place('hyderabad', { name: 'Salar Jung Museum', type: 'attraction', category: 'museum', rating: 4.4, reviewCount: 7000, estimatedCost: 50, visitDuration: 120, popularityScore: 78, tags: ['culture', 'history'], latitude: 17.3714, longitude: 78.4804, image: 'https://images.unsplash.com/photo-1652919197421-49df1892c8d1?w=800' }),
  place('hyderabad', { name: 'Chowmahalla Palace', type: 'attraction', category: 'heritage', rating: 4.5, reviewCount: 5000, estimatedCost: 80, visitDuration: 90, popularityScore: 76, tags: ['history', 'culture', 'photography'], latitude: 17.3580, longitude: 78.4717, image: 'https://images.unsplash.com/photo-1662515898005-c4d8302a426c?w=800' }),
  place('hyderabad', { name: 'Laad Bazaar', type: 'shopping', category: 'market', rating: 4.3, reviewCount: 6000, estimatedCost: 500, visitDuration: 90, popularityScore: 80, tags: ['shopping', 'culture'], latitude: 17.3604, longitude: 78.4740, openingTime: '10:00', closingTime: '21:00', image: 'https://images.unsplash.com/photo-1760262492874-80283261b99c?w=800' }),
  place('hyderabad', { name: 'Birla Mandir', type: 'attraction', category: 'temple', rating: 4.6, reviewCount: 8000, estimatedCost: 0, visitDuration: 60, popularityScore: 79, tags: ['culture', 'scenic'], latitude: 17.4062, longitude: 78.4691, image: 'https://images.unsplash.com/photo-1766592954327-4805e19eae38?w=800' }),

  place('hyderabad', { name: 'Taj Falaknuma Palace', type: 'hotel', category: 'luxury', rating: 4.8, estimatedCost: 20000, visitDuration: 0, popularityScore: 92, tags: ['luxury', 'romantic'], latitude: 17.3325, longitude: 78.4747, priceLevel: 4 },),
  place('hyderabad', { name: 'Hotel Minerva Grand', type: 'hotel', category: 'mid-range', rating: 4.1, estimatedCost: 3500, visitDuration: 0, popularityScore: 74, tags: ['family', 'affordable'], latitude: 17.4100, longitude: 78.4480, priceLevel: 2 }),
  place('hyderabad', { name: 'Zostel Hyderabad', type: 'hotel', category: 'hostel', rating: 4.2, estimatedCost: 900, visitDuration: 0, popularityScore: 78, tags: ['backpacker', 'solo', 'affordable'], latitude: 17.4239, longitude: 78.4483, priceLevel: 1 }),
  place('hyderabad', { name: 'Marigold by GreenPark', type: 'hotel', category: 'business', rating: 4.3, estimatedCost: 5500, visitDuration: 0, popularityScore: 80, tags: ['business', 'family'], latitude: 17.4326, longitude: 78.4472, priceLevel: 3 }),

  place('hyderabad', { name: 'Paradise Restaurant', type: 'restaurant', category: 'biryani', rating: 4.4, estimatedCost: 500, visitDuration: 60, popularityScore: 90, tags: ['food', 'family'], latitude: 17.4400, longitude: 78.4900 }),
  place('hyderabad', { name: 'Bawarchi', type: 'restaurant', category: 'biryani', rating: 4.3, estimatedCost: 450, visitDuration: 60, popularityScore: 85, tags: ['food', 'affordable'], latitude: 17.4000, longitude: 78.4800 }),
  place('hyderabad', { name: 'Cafe Bahar', type: 'restaurant', category: 'biryani', rating: 4.5, estimatedCost: 400, visitDuration: 60, popularityScore: 83, tags: ['food', 'family', 'affordable'], latitude: 17.3900, longitude: 78.4750 }),
  place('hyderabad', { name: 'Shah Ghouse Cafe', type: 'restaurant', category: 'biryani', rating: 4.2, estimatedCost: 350, visitDuration: 60, popularityScore: 81, tags: ['food', 'affordable'], latitude: 17.3620, longitude: 78.4750 }),

  place('hyderabad', { name: 'Cream Stone', type: 'cafe', category: 'dessert', rating: 4.3, estimatedCost: 300, visitDuration: 40, popularityScore: 75, tags: ['food', 'family'], latitude: 17.4239, longitude: 78.4483 }),
  place('hyderabad', { name: 'Ram\'s Own Cafe', type: 'cafe', category: 'coffee', rating: 4.2, estimatedCost: 250, visitDuration: 40, popularityScore: 72, tags: ['food', 'solo'], latitude: 17.4100, longitude: 78.4500 }),
  place('hyderabad', { name: 'Roastery Coffee House', type: 'cafe', category: 'coffee', rating: 4.4, estimatedCost: 350, visitDuration: 45, popularityScore: 74, tags: ['food', 'solo', 'relaxed'], latitude: 17.4260, longitude: 78.4460 }),

  place('hyderabad', { name: 'Hyderabad Boat Club Ride', type: 'activity', category: 'boating', rating: 4.2, estimatedCost: 200, visitDuration: 45, popularityScore: 70, tags: ['scenic', 'family'], latitude: 17.4239, longitude: 78.4738 }),
  place('hyderabad', { name: 'Snow World', type: 'activity', category: 'entertainment', rating: 4.1, estimatedCost: 600, visitDuration: 90, popularityScore: 73, tags: ['entertainment', 'family'], latitude: 17.4132, longitude: 78.4499 }),
  place('hyderabad', { name: 'Nehru Zoological Park', type: 'activity', category: 'wildlife', rating: 4.3, estimatedCost: 100, visitDuration: 150, popularityScore: 76, tags: ['family', 'nature'], latitude: 17.3505, longitude: 78.4514 }),

  // ---------------- JAIPUR ----------------
  place('jaipur', { name: 'Amber Fort', type: 'attraction', category: 'heritage', rating: 4.7, reviewCount: 22000, estimatedCost: 100, visitDuration: 150, popularityScore: 97, tags: ['history', 'photography', 'culture'], latitude: 26.9855, longitude: 75.8513, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800' }),
  place('jaipur', { name: 'Hawa Mahal', type: 'attraction', category: 'heritage', rating: 4.5, reviewCount: 18000, estimatedCost: 50, visitDuration: 60, popularityScore: 93, tags: ['history', 'photography'], latitude: 26.9239, longitude: 75.8267, image: 'https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?w=800' }),
  place('jaipur', { name: 'City Palace', type: 'attraction', category: 'heritage', rating: 4.6, reviewCount: 15000, estimatedCost: 200, visitDuration: 120, popularityScore: 90, tags: ['history', 'culture', 'photography'], latitude: 26.9258, longitude: 75.8237, image: 'https://images.unsplash.com/photo-1667099639128-4b10f464f4a2?w=800' }),
  place('jaipur', { name: 'Jantar Mantar', type: 'attraction', category: 'heritage', rating: 4.4, reviewCount: 9000, estimatedCost: 50, visitDuration: 60, popularityScore: 80, tags: ['history', 'culture'], latitude: 26.9246, longitude: 75.8246, image: 'https://images.unsplash.com/photo-1660736701150-975a90ce2d9e?w=800' }),
  place('jaipur', { name: 'Nahargarh Fort', type: 'attraction', category: 'heritage', rating: 4.5, reviewCount: 8000, estimatedCost: 50, visitDuration: 90, popularityScore: 85, tags: ['history', 'sunset', 'photography', 'romantic'], latitude: 26.9373, longitude: 75.8155 }),
  place('jaipur', { name: 'Jal Mahal', type: 'attraction', category: 'heritage', rating: 4.3, reviewCount: 10000, estimatedCost: 0, visitDuration: 45, popularityScore: 82, tags: ['scenic', 'romantic', 'photography'], latitude: 26.9538, longitude: 75.8464, image: 'https://images.unsplash.com/photo-1661924326425-c14a6426d989?w=800' }),
  place('jaipur', { name: 'Johari Bazaar', type: 'shopping', category: 'market', rating: 4.3, reviewCount: 5000, estimatedCost: 800, visitDuration: 90, popularityScore: 78, tags: ['shopping', 'culture'], latitude: 26.9186, longitude: 75.8267, openingTime: '10:30', closingTime: '20:30', image: 'https://images.unsplash.com/photo-1760262492874-80283261b99c?w=800' }),
  place('jaipur', { name: 'Albert Hall Museum', type: 'attraction', category: 'museum', rating: 4.4, reviewCount: 6000, estimatedCost: 40, visitDuration: 90, popularityScore: 74, tags: ['culture', 'history'], latitude: 26.9114, longitude: 75.8195, image: 'https://images.unsplash.com/photo-1657020613005-080fbdc57a86?w=800' }),

  place('jaipur', { name: 'Rambagh Palace', type: 'hotel', category: 'luxury', rating: 4.8, estimatedCost: 18000, visitDuration: 0, popularityScore: 93, tags: ['luxury', 'romantic'], latitude: 26.8946, longitude: 75.8078, priceLevel: 4 }),
  place('jaipur', { name: 'Hotel Pearl Palace', type: 'hotel', category: 'boutique', rating: 4.5, estimatedCost: 2500, visitDuration: 0, popularityScore: 82, tags: ['boutique', 'affordable', 'couple'], latitude: 26.9080, longitude: 75.8090, priceLevel: 2 }),
  place('jaipur', { name: 'Zostel Jaipur', type: 'hotel', category: 'hostel', rating: 4.3, estimatedCost: 1000, visitDuration: 0, popularityScore: 79, tags: ['backpacker', 'solo', 'affordable'], latitude: 26.9070, longitude: 75.8080, priceLevel: 1 }),
  place('jaipur', { name: 'Trident Jaipur', type: 'hotel', category: 'luxury', rating: 4.6, estimatedCost: 9000, visitDuration: 0, popularityScore: 85, tags: ['luxury', 'family'], latitude: 26.8380, longitude: 75.8060, priceLevel: 4 }),

  place('jaipur', { name: 'Laxmi Misthan Bhandar (LMB)', type: 'restaurant', category: 'local', rating: 4.4, estimatedCost: 400, visitDuration: 60, popularityScore: 86, tags: ['food', 'family'], latitude: 26.9160, longitude: 75.8250 }),
  place('jaipur', { name: 'Chokhi Dhani', type: 'restaurant', category: 'cultural-dining', rating: 4.5, estimatedCost: 900, visitDuration: 150, popularityScore: 88, tags: ['food', 'culture', 'family'], latitude: 26.7930, longitude: 75.8500 }),
  place('jaipur', { name: 'Suvarna Mahal', type: 'restaurant', category: 'fine-dining', rating: 4.7, estimatedCost: 2500, visitDuration: 90, popularityScore: 84, tags: ['food', 'romantic', 'luxury'], latitude: 26.8946, longitude: 75.8078 }),
  place('jaipur', { name: 'Rawat Mishthan Bhandar', type: 'restaurant', category: 'local', rating: 4.3, estimatedCost: 300, visitDuration: 45, popularityScore: 80, tags: ['food', 'affordable'], latitude: 26.9040, longitude: 75.8060 }),

  place('jaipur', { name: 'Tapri Central', type: 'cafe', category: 'tea', rating: 4.4, estimatedCost: 300, visitDuration: 45, popularityScore: 77, tags: ['food', 'friends'], latitude: 26.9080, longitude: 75.8090 }),
  place('jaipur', { name: 'Wind View Cafe', type: 'cafe', category: 'rooftop', rating: 4.5, estimatedCost: 500, visitDuration: 60, popularityScore: 81, tags: ['romantic', 'photography', 'scenic'], latitude: 26.9243, longitude: 75.8262 }),
  place('jaipur', { name: 'Anokhi Cafe', type: 'cafe', category: 'organic', rating: 4.3, estimatedCost: 450, visitDuration: 45, popularityScore: 73, tags: ['food', 'solo', 'relaxed'], latitude: 26.9020, longitude: 75.8070 }),

  place('jaipur', { name: 'Hot Air Balloon Ride', type: 'activity', category: 'adventure', rating: 4.6, estimatedCost: 9500, visitDuration: 90, popularityScore: 83, tags: ['adventure', 'photography', 'romantic'], latitude: 26.9540, longitude: 75.8100 }),
  place('jaipur', { name: 'Elephant Safari at Amber', type: 'activity', category: 'wildlife', rating: 4.2, estimatedCost: 1200, visitDuration: 30, popularityScore: 76, tags: ['family', 'adventure'], latitude: 26.9855, longitude: 75.8513 }),

  // ---------------- MANALI ----------------
  place('manali', { name: 'Solang Valley', type: 'attraction', category: 'nature', rating: 4.6, reviewCount: 12000, estimatedCost: 0, visitDuration: 180, popularityScore: 94, tags: ['adventure', 'nature', 'photography'], latitude: 32.3175, longitude: 77.1567, image: 'https://images.unsplash.com/photo-1677820915325-d8ce3184c2a4?w=800' }),
  place('manali', { name: 'Rohtang Pass', type: 'attraction', category: 'nature', rating: 4.7, reviewCount: 9000, estimatedCost: 550, visitDuration: 240, popularityScore: 92, tags: ['adventure', 'nature', 'photography'], latitude: 32.3722, longitude: 77.2467, image: 'https://images.unsplash.com/photo-1646153081518-523e07c69c27?w=800' }),
  place('manali', { name: 'Hadimba Temple', type: 'attraction', category: 'temple', rating: 4.5, reviewCount: 8000, estimatedCost: 0, visitDuration: 45, popularityScore: 85, tags: ['culture', 'nature', 'photography'], latitude: 32.2432, longitude: 77.1687, image: 'https://images.unsplash.com/photo-1563630237204-9a7b77a857e0?w=800' }),
  place('manali', { name: 'Old Manali', type: 'attraction', category: 'village', rating: 4.5, reviewCount: 7000, estimatedCost: 0, visitDuration: 120, popularityScore: 84, tags: ['culture', 'nightlife', 'photography', 'friends'], latitude: 32.2532, longitude: 77.1687, image: 'https://images.unsplash.com/photo-1597167231350-d057a45dc868?w=800' }),
  place('manali', { name: 'Jogini Waterfall', type: 'attraction', category: 'nature', rating: 4.4, reviewCount: 4000, estimatedCost: 0, visitDuration: 120, popularityScore: 78, tags: ['nature', 'adventure', 'photography'], latitude: 32.2650, longitude: 77.1900, image: 'https://images.unsplash.com/photo-1697014960832-a8e9bab33855?w=800' }),
  place('manali', { name: 'Manu Temple', type: 'attraction', category: 'temple', rating: 4.3, reviewCount: 3000, estimatedCost: 0, visitDuration: 30, popularityScore: 68, tags: ['culture'], latitude: 32.2650, longitude: 77.1700 }),

  place('manali', { name: 'The Himalayan Resort', type: 'hotel', category: 'luxury', rating: 4.6, estimatedCost: 8500, visitDuration: 0, popularityScore: 86, tags: ['luxury', 'family'], latitude: 32.2600, longitude: 77.1850, priceLevel: 4 }),
  place('manali', { name: 'Zostel Old Manali', type: 'hotel', category: 'hostel', rating: 4.4, estimatedCost: 800, visitDuration: 0, popularityScore: 80, tags: ['backpacker', 'solo', 'affordable', 'friends'], latitude: 32.2550, longitude: 77.1680, priceLevel: 1 }),
  place('manali', { name: 'Snow Valley Resorts', type: 'hotel', category: 'mid-range', rating: 4.2, estimatedCost: 3800, visitDuration: 0, popularityScore: 75, tags: ['family', 'affordable'], latitude: 32.2450, longitude: 77.1900, priceLevel: 2 }),

  place('manali', { name: 'Johnson\'s Cafe', type: 'restaurant', category: 'multi-cuisine', rating: 4.5, estimatedCost: 700, visitDuration: 75, popularityScore: 83, tags: ['food', 'romantic'], latitude: 32.2460, longitude: 77.1880 }),
  place('manali', { name: 'Renaissance Restaurant', type: 'restaurant', category: 'local', rating: 4.3, estimatedCost: 450, visitDuration: 60, popularityScore: 76, tags: ['food', 'family'], latitude: 32.2440, longitude: 77.1890 }),
  place('manali', { name: 'Cafe 1947', type: 'restaurant', category: 'multi-cuisine', rating: 4.6, estimatedCost: 600, visitDuration: 75, popularityScore: 84, tags: ['food', 'scenic', 'friends'], latitude: 32.2550, longitude: 77.1690 }),

  place('manali', { name: 'Drifters Cafe', type: 'cafe', category: 'coffee', rating: 4.4, estimatedCost: 350, visitDuration: 45, popularityScore: 78, tags: ['food', 'solo', 'relaxed'], latitude: 32.2560, longitude: 77.1670 }),
  place('manali', { name: 'Lazy Dog Lounge', type: 'cafe', category: 'lounge', rating: 4.5, estimatedCost: 500, visitDuration: 60, popularityScore: 80, tags: ['friends', 'nightlife'], latitude: 32.2540, longitude: 77.1660 }),

  place('manali', { name: 'Paragliding at Solang', type: 'activity', category: 'adventure', rating: 4.6, estimatedCost: 2500, visitDuration: 30, popularityScore: 87, tags: ['adventure', 'photography', 'friends'], latitude: 32.3175, longitude: 77.1567 }),
  place('manali', { name: 'River Rafting on Beas', type: 'activity', category: 'water-sports', rating: 4.4, estimatedCost: 900, visitDuration: 60, popularityScore: 81, tags: ['adventure', 'friends'], latitude: 32.2000, longitude: 77.1600 }),
  place('manali', { name: 'Snow Skiing at Solang', type: 'activity', category: 'adventure', rating: 4.3, estimatedCost: 1800, visitDuration: 120, popularityScore: 79, tags: ['adventure', 'family'], latitude: 32.3180, longitude: 77.1570 }),

  // ---------------- KERALA ----------------
  place('kerala', { name: 'Alleppey Backwaters Houseboat', type: 'activity', category: 'cruise', rating: 4.8, reviewCount: 15000, estimatedCost: 6000, visitDuration: 300, popularityScore: 97, tags: ['nature', 'romantic', 'scenic', 'family'], latitude: 9.4981, longitude: 76.3388 }),
  place('kerala', { name: 'Munnar Tea Gardens', type: 'attraction', category: 'nature', rating: 4.7, reviewCount: 13000, estimatedCost: 100, visitDuration: 150, popularityScore: 93, tags: ['nature', 'photography', 'family'], latitude: 10.0889, longitude: 77.0595, image: 'https://images.unsplash.com/photo-1719831738921-972e0ec76337?w=800' }),
  place('kerala', { name: 'Fort Kochi Beach', type: 'attraction', category: 'beach', rating: 4.4, reviewCount: 9000, estimatedCost: 0, visitDuration: 90, popularityScore: 85, tags: ['beach', 'culture', 'photography'], latitude: 9.9658, longitude: 76.2422, image: 'https://images.unsplash.com/photo-1709356920024-50073083c318?w=800' }),
  place('kerala', { name: 'Periyar Wildlife Sanctuary', type: 'attraction', category: 'wildlife', rating: 4.5, reviewCount: 8000, estimatedCost: 300, visitDuration: 180, popularityScore: 84, tags: ['nature', 'adventure', 'family'], latitude: 9.4630, longitude: 77.2419, image: 'https://images.unsplash.com/photo-1765636011267-8b445af967f5?w=800' }),
  place('kerala', { name: 'Chinese Fishing Nets', type: 'attraction', category: 'heritage', rating: 4.3, reviewCount: 7000, estimatedCost: 0, visitDuration: 45, popularityScore: 78, tags: ['culture', 'photography', 'sunset'], latitude: 9.9658, longitude: 76.2400, image: 'https://images.unsplash.com/photo-1714931862306-7abe321b6b5f?w=800' }),
  place('kerala', { name: 'Varkala Cliff Beach', type: 'attraction', category: 'beach', rating: 4.6, reviewCount: 6000, estimatedCost: 0, visitDuration: 120, popularityScore: 86, tags: ['beach', 'scenic', 'romantic', 'photography'], latitude: 8.7379, longitude: 76.7163, image: 'https://images.unsplash.com/photo-1655394602738-eff266100405?w=800' }),

  place('kerala', { name: 'Kumarakom Lake Resort', type: 'hotel', category: 'luxury', rating: 4.7, estimatedCost: 14000, visitDuration: 0, popularityScore: 90, tags: ['luxury', 'romantic'], latitude: 9.6180, longitude: 76.4300, priceLevel: 4 }),
  place('kerala', { name: 'Fort Heritage Homestay', type: 'hotel', category: 'homestay', rating: 4.5, estimatedCost: 2800, visitDuration: 0, popularityScore: 79, tags: ['boutique', 'affordable', 'culture'], latitude: 9.9658, longitude: 76.2422, priceLevel: 2 }),
  place('kerala', { name: 'Zostel Kochi', type: 'hotel', category: 'hostel', rating: 4.3, estimatedCost: 900, visitDuration: 0, popularityScore: 77, tags: ['backpacker', 'solo', 'affordable'], latitude: 9.9700, longitude: 76.2800, priceLevel: 1 }),

  place('kerala', { name: 'Kayees Rahmathulla Hotel', type: 'restaurant', category: 'local', rating: 4.5, estimatedCost: 350, visitDuration: 60, popularityScore: 84, tags: ['food', 'affordable', 'family'], latitude: 9.9700, longitude: 76.2450 }),
  place('kerala', { name: 'Dal Roti', type: 'restaurant', category: 'multi-cuisine', rating: 4.4, estimatedCost: 500, visitDuration: 60, popularityScore: 81, tags: ['food', 'family'], latitude: 9.9660, longitude: 76.2430 }),
  place('kerala', { name: 'Rice Boat Restaurant', type: 'restaurant', category: 'seafood', rating: 4.6, estimatedCost: 900, visitDuration: 90, popularityScore: 85, tags: ['food', 'romantic', 'scenic'], latitude: 9.6000, longitude: 76.4000 }),

  place('kerala', { name: 'Teapot Cafe', type: 'cafe', category: 'tea', rating: 4.5, estimatedCost: 300, visitDuration: 45, popularityScore: 79, tags: ['food', 'romantic', 'photography'], latitude: 9.9655, longitude: 76.2415 }),
  place('kerala', { name: 'Coffee Beanz', type: 'cafe', category: 'coffee', rating: 4.2, estimatedCost: 300, visitDuration: 40, popularityScore: 71, tags: ['food', 'solo'], latitude: 9.9680, longitude: 76.2440 }),

  place('kerala', { name: 'Ayurvedic Spa Session', type: 'activity', category: 'wellness', rating: 4.6, estimatedCost: 2500, visitDuration: 90, popularityScore: 82, tags: ['relaxed', 'romantic', 'solo'], latitude: 9.9658, longitude: 76.2422 }),
  place('kerala', { name: 'Kathakali Dance Show', type: 'activity', category: 'cultural-show', rating: 4.5, estimatedCost: 400, visitDuration: 90, popularityScore: 80, tags: ['culture', 'family'], latitude: 9.9658, longitude: 76.2422, openingTime: '18:00', closingTime: '20:30' }),
];
