export interface Movie {
  id: string;
  title: string;
  description: string;
  year: number;
  rating: number;
  duration: string;
  genres: string[];
  language: string;
  quality: string[];
  isPremium: boolean;
  posterUrl: string;
  backdropUrl: string;
  cast: string[];
  director: string;
  trailerUrl?: string;
  views: number;
  likes: number;
}

export const genres = [
  "Action", "Comedy", "Drama", "Thriller", "Sci-Fi", "Horror",
  "Romance", "Animation", "Documentary", "Adventure", "Fantasy", "Mystery"
];

export const languages = ["English", "Hindi", "Spanish", "French", "Korean", "Japanese"];

export const movies: Movie[] = [
  {
    id: "1",
    title: "Shadow Protocol",
    description: "A covert agent discovers a global conspiracy that threatens to reshape the world order. With time running out, she must navigate a web of deception and danger to prevent catastrophe.",
    year: 2024,
    rating: 8.7,
    duration: "2h 18m",
    genres: ["Action", "Thriller"],
    language: "English",
    quality: ["4K", "1080p", "720p", "480p"],
    isPremium: true,
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop",
    cast: ["Elena Vasquez", "James Chen", "Sarah Mitchell"],
    director: "Marcus Webb",
    views: 1250000,
    likes: 89000,
  },
  {
    id: "2",
    title: "Neon Dreams",
    description: "In a cyberpunk metropolis, a hacker stumbles upon an AI that could either save humanity or destroy it. A visually stunning journey through digital landscapes and human emotions.",
    year: 2024,
    rating: 9.1,
    duration: "2h 35m",
    genres: ["Sci-Fi", "Drama"],
    language: "English",
    quality: ["4K", "1080p", "720p"],
    isPremium: true,
    posterUrl: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=1920&h=1080&fit=crop",
    cast: ["Kai Nakamura", "Luna Park", "David Stone"],
    director: "Yuki Tanaka",
    views: 2100000,
    likes: 156000,
  },
  {
    id: "3",
    title: "The Last Garden",
    description: "A heartwarming tale of an elderly botanist who discovers that her garden holds the key to reversing climate change. A beautiful story of hope, legacy, and the power of nature.",
    year: 2023,
    rating: 8.4,
    duration: "1h 52m",
    genres: ["Drama", "Fantasy"],
    language: "English",
    quality: ["1080p", "720p", "480p"],
    isPremium: false,
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&h=1080&fit=crop",
    cast: ["Margaret Osei", "Tom Rivera", "Aisha Khan"],
    director: "Claire Fontaine",
    views: 890000,
    likes: 72000,
  },
  {
    id: "4",
    title: "Midnight Pursuit",
    description: "When a detective's partner goes missing during an undercover operation, she must race against time through the city's criminal underworld to find him before it's too late.",
    year: 2024,
    rating: 7.9,
    duration: "2h 05m",
    genres: ["Thriller", "Mystery"],
    language: "English",
    quality: ["4K", "1080p", "720p", "480p"],
    isPremium: false,
    posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&h=1080&fit=crop",
    cast: ["Rachel Torres", "Mike Johnson", "Priya Sharma"],
    director: "Anthony Blake",
    views: 670000,
    likes: 45000,
  },
  {
    id: "5",
    title: "Echoes of Mars",
    description: "The first colonists on Mars discover ancient structures beneath the surface, revealing that humanity is not alone in the universe. A grand space epic.",
    year: 2024,
    rating: 8.9,
    duration: "2h 42m",
    genres: ["Sci-Fi", "Adventure"],
    language: "English",
    quality: ["4K", "1080p"],
    isPremium: true,
    posterUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920&h=1080&fit=crop",
    cast: ["Zara Williams", "Oscar Lee", "Nina Petrov"],
    director: "Ryan Costa",
    views: 3200000,
    likes: 245000,
  },
  {
    id: "6",
    title: "Laughing Stock",
    description: "A struggling comedian gets one last shot at stardom when a viral video lands him a spot on the biggest comedy show in the country. Hilarity and heart ensue.",
    year: 2023,
    rating: 7.6,
    duration: "1h 48m",
    genres: ["Comedy", "Drama"],
    language: "English",
    quality: ["1080p", "720p", "480p"],
    isPremium: false,
    posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop",
    cast: ["Danny Reeves", "Sophie Chang", "Carlos Mendez"],
    director: "Lisa Park",
    views: 520000,
    likes: 38000,
  },
  {
    id: "7",
    title: "Ocean's Whisper",
    description: "A marine biologist discovers a new species deep in the ocean that communicates through bioluminescent patterns. But a corporation wants to exploit the discovery.",
    year: 2024,
    rating: 8.2,
    duration: "2h 10m",
    genres: ["Adventure", "Drama"],
    language: "English",
    quality: ["4K", "1080p", "720p"],
    isPremium: true,
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop",
    cast: ["Maya Torres", "Liam Scott", "Kenji Sato"],
    director: "Olivia Chen",
    views: 980000,
    likes: 67000,
  },
  {
    id: "8",
    title: "Digital Fortress",
    description: "When the world's banking systems are hacked simultaneously, a team of elite cybersecurity experts must trace the attack to its source before global economies collapse.",
    year: 2024,
    rating: 8.5,
    duration: "2h 22m",
    genres: ["Thriller", "Action"],
    language: "English",
    quality: ["4K", "1080p", "720p", "480p"],
    isPremium: false,
    posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&h=1080&fit=crop",
    cast: ["Alex Reeves", "Nadia Kim", "Bruno Fischer"],
    director: "Sam Patel",
    views: 1450000,
    likes: 98000,
  },
  {
    id: "9",
    title: "Sakura Road",
    description: "A touching story of two strangers who meet on a train in Japan during cherry blossom season and discover that their lives are connected in unexpected ways.",
    year: 2023,
    rating: 8.8,
    duration: "1h 58m",
    genres: ["Romance", "Drama"],
    language: "Japanese",
    quality: ["1080p", "720p"],
    isPremium: true,
    posterUrl: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1920&h=1080&fit=crop",
    cast: ["Hana Yoshida", "Ren Takahashi", "Mei Lin"],
    director: "Akira Sato",
    views: 760000,
    likes: 82000,
  },
  {
    id: "10",
    title: "Phantom Ridge",
    description: "A group of hikers discover an abandoned town in the mountains that shouldn't exist on any map. As night falls, they realize they're not alone.",
    year: 2024,
    rating: 7.8,
    duration: "1h 45m",
    genres: ["Horror", "Mystery"],
    language: "English",
    quality: ["1080p", "720p", "480p"],
    isPremium: false,
    posterUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1920&h=1080&fit=crop",
    cast: ["Jake Morrison", "Emily Hart", "Diego Ruiz"],
    director: "Karen Walsh",
    views: 430000,
    likes: 29000,
  },
  {
    id: "11",
    title: "Rise of Titans",
    description: "Ancient gods awaken in the modern world, and a young archaeologist is the only one who can communicate with them. An epic fantasy adventure.",
    year: 2024,
    rating: 8.3,
    duration: "2h 30m",
    genres: ["Fantasy", "Action", "Adventure"],
    language: "English",
    quality: ["4K", "1080p", "720p"],
    isPremium: true,
    posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1920&h=1080&fit=crop",
    cast: ["Diana Cross", "Marcus Aurelius", "Fatima Al-Hassan"],
    director: "Victor Hugo",
    views: 1870000,
    likes: 134000,
  },
  {
    id: "12",
    title: "Code Zero",
    description: "A documentary exploring the rise of artificial intelligence and its impact on society, featuring interviews with leading researchers and ethicists.",
    year: 2023,
    rating: 9.0,
    duration: "1h 40m",
    genres: ["Documentary", "Sci-Fi"],
    language: "English",
    quality: ["4K", "1080p"],
    isPremium: false,
    posterUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&h=1080&fit=crop",
    cast: [],
    director: "Amy Zhang",
    views: 2500000,
    likes: 198000,
  },
];

export const trendingMovies = movies.filter(m => m.views > 1000000);
export const premiumMovies = movies.filter(m => m.isPremium);
export const freeMovies = movies.filter(m => !m.isPremium);
export const newReleases = movies.filter(m => m.year === 2024);

export const getMoviesByGenre = (genre: string) =>
  movies.filter(m => m.genres.includes(genre));

export const getMovieById = (id: string) =>
  movies.find(m => m.id === id);

export const searchMovies = (query: string) =>
  movies.filter(m =>
    m.title.toLowerCase().includes(query.toLowerCase()) ||
    m.genres.some(g => g.toLowerCase().includes(query.toLowerCase())) ||
    m.director.toLowerCase().includes(query.toLowerCase())
  );
