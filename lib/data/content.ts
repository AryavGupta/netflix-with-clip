export interface Content {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  backdropImage: string;
  videoUrl: string;
  duration: number; // in seconds
  genre: string[];
  year: number;
  rating: 'G' | 'PG' | 'PG-13' | 'R' | 'TV-MA' | 'TV-14' | '17+';
  cast: string[];
  director: string;
  type: 'movie' | 'series';
  featured?: boolean;
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  seasonNumber: number;
  episodeNumber: number;
}

// Demo content with free video URLs (Big Buck Bunny, Sintel, etc.)
export const DEMO_CONTENT: Content[] = [
  // Featured Game Content for Hero Banner
  {
    id: "gta-san-andreas",
    title: "GTA: San Andreas - The Definitive Edition",
    description: "Take control of the streets. Return to your hometown to save your family and clear your name in this '90s West Coast adventure.",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=400&fit=crop",
    backdropImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: 7200,
    genre: ["Action", "Adventure", "Open World"],
    year: 2021,
    rating: "17+",
    cast: ["Game Characters", "Voice Actors"],
    director: "Rockstar Games",
    type: "movie",
    featured: true
  },
  {
    id: "1",
    title: "Big Buck Bunny",
    description: "A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness.",
    thumbnail: "https://images.unsplash.com/photo-1489599843714-2c23a5de6238?w=400&h=225&fit=crop",
    backdropImage: "https://images.unsplash.com/photo-1489599843714-2c23a5de6238?w=1920&h=1080&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: 596,
    genre: ["Animation", "Comedy", "Family"],
    year: 2008,
    rating: "G",
    cast: ["Sacha Goedegebure", "Frank Ekkebus", "Jan Morgenstern"],
    director: "Sacha Goedegebure",
    type: "movie"
  },
  {
    id: "2", 
    title: "Sintel",
    description: "A lonely young woman, Sintel, helps and befriends a dragon, whom she calls Scales. But when he is kidnapped by an adult dragon, Sintel decides to embark on a dangerous quest to find her lost friend Scales.",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=225&fit=crop",
    backdropImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    duration: 888,
    genre: ["Animation", "Fantasy", "Drama"],
    year: 2010,
    rating: "PG",
    cast: ["Halina Reijn", "Thom Hoffman"],
    director: "Colin Levy",
    type: "movie"
  },
  {
    id: "3",
    title: "Tears of Steel",
    description: "In an apocalyptic future, a group of soldiers and scientists takes refuge in Amsterdam to try to stop an army of robots that threatens to destroy the world.",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=225&fit=crop",
    backdropImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    duration: 734,
    genre: ["Sci-Fi", "Action", "Drama"],
    year: 2012,
    rating: "PG-13",
    cast: ["Derek de Lint", "Berenice Bejo", "Casper Crump"],
    director: "Ian Hubert",
    type: "movie"
  },
  {
    id: "4",
    title: "Elephant Dream",
    description: "The story of two strange characters exploring a capricious and seemingly infinite machine. The elder, Proog, acts as a tour-guide and protector, happily showing off the sights and dangers of the machine to his initially curious but increasingly skeptical protege Emo.",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop",
    backdropImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: 654,
    genre: ["Animation", "Fantasy", "Sci-Fi"],
    year: 2006,
    rating: "G",
    cast: ["Tygo Gernandt", "Cas Jansen"],
    director: "Bassam Kurdali",
    type: "movie"
  },
  {
    id: "5",
    title: "For Bigger Blazes",
    description: "A thrilling adventure featuring amazing fire scenes and spectacular action sequences.",
    thumbnail: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=225&fit=crop",
    backdropImage: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1920&h=1080&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: 15,
    genre: ["Action", "Adventure"],
    year: 2023,
    rating: "PG-13",
    cast: ["Demo Actor 1", "Demo Actor 2"],
    director: "Demo Director",
    type: "movie"
  },
  {
    id: "6",
    title: "For Bigger Escape",
    description: "An intense escape thriller that will keep you on the edge of your seat.",
    thumbnail: "https://images.unsplash.com/photo-1489599843714-2c23a5de6238?w=400&h=225&fit=crop",
    backdropImage: "https://images.unsplash.com/photo-1489599843714-2c23a5de6238?w=1920&h=1080&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: 15,
    genre: ["Thriller", "Action"],
    year: 2023,
    rating: "R",
    cast: ["Demo Actor 3", "Demo Actor 4"],
    director: "Demo Director 2",
    type: "movie"
  }
];

export const CONTENT_ROWS = [
  {
    title: "Popular mobile games for you",
    items: DEMO_CONTENT.slice(0, 4)
  },
  {
    title: "Trending Now",
    items: DEMO_CONTENT.slice(1, 5)
  },
  {
    title: "Action & Adventure", 
    items: DEMO_CONTENT.filter(c => c.genre.includes("Action"))
  },
  {
    title: "Animation",
    items: DEMO_CONTENT.filter(c => c.genre.includes("Animation"))
  },
  {
    title: "Sci-Fi Movies",
    items: DEMO_CONTENT.filter(c => c.genre.includes("Sci-Fi"))
  },
  {
    title: "Recently Added",
    items: DEMO_CONTENT.slice(2, 6)
  }
];

export const getFeaturedContent = (): Content => {
  return DEMO_CONTENT.find(c => c.featured) || DEMO_CONTENT[0];
};

export const getContentById = (id: string): Content | null => {
  return DEMO_CONTENT.find(c => c.id === id) || null;
};