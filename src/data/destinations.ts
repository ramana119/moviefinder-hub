import { createPrice } from '../utils/priceUtils';

export const destinations = [
  {
    id: "dest_1",
    name: "Hidden Valley",
    description: "A serene valley tucked away in the mountains...",
    coordinates: {
      lat: 45.4215,
      lng: -75.6972
    },
    images: ["valley1.jpg", "valley2.jpg"],
    price: createPrice(299),
    attractions: ["Waterfall Trail", "Mountain View Point"],
    tags: ["nature", "hiking", "peaceful"]
  },
  {
    id: "dest_2",
    name: "Crystal Lake",
    description: "A pristine lake surrounded by ancient forests...",
    coordinates: {
      lat: 34.0522,
      lng: -118.2437
    },
    images: ["lake1.jpg", "lake2.jpg"],
    price: createPrice(349),
    attractions: ["Boat Tours", "Lakeside Camping"],
    tags: ["lake", "camping", "fishing"]
  },
  {
    id: "dest_3",
    name: "Sunset Desert",
    description: "Experience the magic of the desert at sunset...",
    coordinates: {
      lat: 33.7294,
      lng: -116.3631
    },
    images: ["desert1.jpg", "desert2.jpg"],
    price: createPrice(499),
    attractions: ["Camel Rides", "Stargazing"],
    tags: ["desert", "adventure", "stargazing"]
  },
  {
    id: "dest_4",
    name: "Enchanted Forest",
    description: "A mystical forest filled with rare flora and fauna...",
    coordinates: {
      lat: 47.7511,
      lng: -120.7401
    },
    images: ["forest1.jpg", "forest2.jpg"],
    price: createPrice(399),
    attractions: ["Mushroom Picking", "Bird Watching"],
    tags: ["forest", "nature", "wildlife"]
  },
  {
    id: "dest_5",
    name: "Azure Coast",
    description: "Breathtaking coastal views and crystal-clear waters...",
    coordinates: {
      lat: 35.6895,
      lng: 139.6917
    },
    images: ["coast1.jpg", "coast2.jpg"],
    price: createPrice(549),
    attractions: ["Snorkeling", "Beach Relaxation"],
    tags: ["beach", "ocean", "relaxation"]
  },
  {
    id: "dest_6",
    name: "Snowy Peaks",
    description: "Majestic snow-capped mountains perfect for skiing...",
    coordinates: {
      lat: 64.8151,
      lng: -147.7164
    },
    images: ["mountain1.jpg", "mountain2.jpg"],
    price: createPrice(699),
    attractions: ["Skiing", "Snowboarding"],
    tags: ["mountains", "skiing", "snow"]
  },
  {
    id: "dest_7",
    name: "Tropical Paradise",
    description: "Exotic island with white sandy beaches and lush greenery...",
    coordinates: {
      lat: -17.5000,
      lng: -149.5667
    },
    images: ["island1.jpg", "island2.jpg"],
    price: createPrice(799),
    attractions: ["Scuba Diving", "Island Hopping"],
    tags: ["island", "tropical", "diving"]
  },
  {
    id: "dest_8",
    name: "Ancient Ruins",
    description: "Explore the remnants of a lost civilization...",
    coordinates: {
      lat: 27.986065,
      lng: 86.922623
    },
    images: ["ruins1.jpg", "ruins2.jpg"],
    price: createPrice(449),
    attractions: ["Historical Tours", "Archaeological Sites"],
    tags: ["history", "culture", "ancient"]
  },
  {
    id: "dest_9",
    name: "Vibrant City",
    description: "Experience the hustle and bustle of a modern metropolis...",
    coordinates: {
      lat: 40.7128,
      lng: -74.0060
    },
    images: ["city1.jpg", "city2.jpg"],
    price: createPrice(599),
    attractions: ["Museums", "Shopping"],
    tags: ["city", "urban", "shopping"]
  },
  {
    id: "dest_10",
    name: "Rolling Hills",
    description: "Picturesque countryside with vineyards and farms...",
    coordinates: {
      lat: 45.7597,
      lng: 4.8422
    },
    images: ["countryside1.jpg", "countryside2.jpg"],
    price: createPrice(349),
    attractions: ["Wine Tasting", "Farm Tours"],
    tags: ["countryside", "wine", "farming"]
  }
] as const;

export type DestinationType = typeof destinations[number];
export type DestinationId = DestinationType["id"];
