
export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  duration: string;
  genre: string[];
  language: string;
  rating: number;
  description: string;
  trailerUrl: string;
  cast: {
    name: string;
    character: string;
    photoUrl: string;
  }[];
  director: string;
  format: string[];
}

export interface Theater {
  id: string;
  name: string;
  location: string;
  city: string;
  facilities: string[];
}

export interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  date: string;
  time: string;
  format: string;
  price: {
    standard: number;
    premium: number;
    vip: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  bookings: Booking[];
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'standard' | 'premium' | 'vip';
  isBooked: boolean;
  isSelected?: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  movieId: string;
  theaterId: string;
  showtimeId: string;
  seats: Seat[];
  totalAmount: number;
  bookingDate: string;
  paymentStatus: 'pending' | 'completed';
  bookingStatus: 'confirmed' | 'cancelled';
  qrCode?: string;
}

export const movies: Movie[] = [
  {
    id: '1',
    title: 'Interstellar',
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/pbrkL804c8yAv3zBZR4QPEafpAR.jpg',
    releaseDate: '2023-11-05',
    duration: '2h 49m',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    language: 'English',
    rating: 8.6,
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    cast: [
      { name: 'Matthew McConaughey', character: 'Joseph Cooper', photoUrl: 'https://image.tmdb.org/t/p/w200/e9ZHRY5toihZRFe2uYe1KQrf0o6.jpg' },
      { name: 'Anne Hathaway', character: 'Dr. Amelia Brand', photoUrl: 'https://image.tmdb.org/t/p/w200/tLelKoPNiyJCSEtQTz1FGrfqwkP.jpg' },
      { name: 'Jessica Chastain', character: 'Murphy Cooper', photoUrl: 'https://image.tmdb.org/t/p/w200/lCiUTJWbkMHZKVQqCgX68wAAOhn.jpg' }
    ],
    director: 'Christopher Nolan',
    format: ['2D', 'IMAX', '4DX']
  },
  {
    id: '2',
    title: 'Dune: Part Two',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/e9XRikkyth0GtG8RkU3XNm0oMsI.jpg',
    releaseDate: '2024-03-01',
    duration: '2h 46m',
    genre: ['Sci-Fi', 'Adventure', 'Action'],
    language: 'English',
    rating: 8.7,
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.',
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    cast: [
      { name: 'Timothée Chalamet', character: 'Paul Atreides', photoUrl: 'https://image.tmdb.org/t/p/w200/ddNKGrxDZYs0SURnOmAuXGIE6YI.jpg' },
      { name: 'Zendaya', character: 'Chani', photoUrl: 'https://image.tmdb.org/t/p/w200/6TE2AlOUqcrs7CyJiWYgodmee1z.jpg' },
      { name: 'Rebecca Ferguson', character: 'Lady Jessica', photoUrl: 'https://image.tmdb.org/t/p/w200/4E0esj18NQnZ0nIYJIFv8xCRoF3.jpg' }
    ],
    director: 'Denis Villeneuve',
    format: ['2D', 'IMAX', '3D']
  },
  {
    id: '3',
    title: 'Oppenheimer',
    posterUrl: 'https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg',
    releaseDate: '2023-07-21',
    duration: '3h 0m',
    genre: ['Drama', 'History', 'Thriller'],
    language: 'English',
    rating: 8.4,
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg',
    cast: [
      { name: 'Cillian Murphy', character: 'J. Robert Oppenheimer', photoUrl: 'https://image.tmdb.org/t/p/w200/dm6V24NjjvjMiCtbMkc8Y2WPm2e.jpg' },
      { name: 'Emily Blunt', character: 'Katherine Oppenheimer', photoUrl: 'https://image.tmdb.org/t/p/w200/xDc98BVQpfHBLRUNiLnUbm7JqOY.jpg' },
      { name: 'Matt Damon', character: 'Leslie Groves', photoUrl: 'https://image.tmdb.org/t/p/w200/huVOlgcnUx5l6K5EvqrAWi10E5Z.jpg' }
    ],
    director: 'Christopher Nolan',
    format: ['2D', 'IMAX']
  },
  {
    id: '4',
    title: 'Everything Everywhere All at Once',
    posterUrl: 'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/mDfJG3LC3Dqb67AZ52x3Z0jU0uB.jpg',
    releaseDate: '2022-03-25',
    duration: '2h 19m',
    genre: ['Action', 'Adventure', 'Comedy'],
    language: 'English',
    rating: 8.2,
    description: 'An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led.',
    trailerUrl: 'https://www.youtube.com/embed/wxN1T1uxQ2g',
    cast: [
      { name: 'Michelle Yeoh', character: 'Evelyn Wang', photoUrl: 'https://image.tmdb.org/t/p/w200/6oxvfyXnGOwx5hQ0r73P7i83Gps.jpg' },
      { name: 'Ke Huy Quan', character: 'Waymond Wang', photoUrl: 'https://image.tmdb.org/t/p/w200/4YAhKj5pXxtxKDXoZTbJcAuKKgT.jpg' },
      { name: 'Jamie Lee Curtis', character: 'Deirdre Beaubeirdre', photoUrl: 'https://image.tmdb.org/t/p/w200/8TcxRln8z6FbTS7JWxX6jH7QH5F.jpg' }
    ],
    director: 'Daniel Kwan, Daniel Scheinert',
    format: ['2D']
  },
  {
    id: '5',
    title: 'The Batman',
    posterUrl: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
    releaseDate: '2022-03-04',
    duration: '2h 56m',
    genre: ['Crime', 'Mystery', 'Action'],
    language: 'English',
    rating: 7.9,
    description: 'When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham, Batman is forced to investigate the city\'s hidden corruption and question his family\'s involvement.',
    trailerUrl: 'https://www.youtube.com/embed/mqqft2x_Aa4',
    cast: [
      { name: 'Robert Pattinson', character: 'Bruce Wayne', photoUrl: 'https://image.tmdb.org/t/p/w200/vVEwQlgaJYR3PvczKRyYzGZgJ7e.jpg' },
      { name: 'Zoë Kravitz', character: 'Selina Kyle', photoUrl: 'https://image.tmdb.org/t/p/w200/4D0PpNI0kmP58hgrwGC3wCjxhnm.jpg' },
      { name: 'Paul Dano', character: 'The Riddler', photoUrl: 'https://image.tmdb.org/t/p/w200/tB8CrXsvXGE6O7BfUAtVMdXbmqd.jpg' }
    ],
    director: 'Matt Reeves',
    format: ['2D', 'IMAX']
  },
  {
    id: '6',
    title: 'Barbie',
    posterUrl: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi8Qzsk3Yd4C.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/ctMserH8g2SeOAnCw5gFjdQF8mo.jpg',
    releaseDate: '2023-07-21',
    duration: '1h 54m',
    genre: ['Comedy', 'Adventure', 'Fantasy'],
    language: 'English',
    rating: 7.5,
    description: 'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.',
    trailerUrl: 'https://www.youtube.com/embed/pBk4NYhWNMM',
    cast: [
      { name: 'Margot Robbie', character: 'Barbie', photoUrl: 'https://image.tmdb.org/t/p/w200/euDPyqLnuwaWMHajcU3oZ9uZezR.jpg' },
      { name: 'Ryan Gosling', character: 'Ken', photoUrl: 'https://image.tmdb.org/t/p/w200/lyUyVARQKhGxaTSTKR79l9XCWsb.jpg' },
      { name: 'America Ferrera', character: 'Gloria', photoUrl: 'https://image.tmdb.org/t/p/w200/uzYsRhVkPXdl7mGKPkkPvDJrLOF.jpg' }
    ],
    director: 'Greta Gerwig',
    format: ['2D', 'IMAX']
  },
];

export const theaters: Theater[] = [
  {
    id: '1',
    name: 'Cineplex Luxury',
    location: 'Downtown',
    city: 'New York',
    facilities: ['Dolby Atmos', 'Recliner Seats', 'Food Service']
  },
  {
    id: '2',
    name: 'IMAX Supreme',
    location: 'Midtown',
    city: 'New York',
    facilities: ['IMAX Screen', 'Premium Sound', 'Lounge']
  },
  {
    id: '3',
    name: 'Star Cinemas',
    location: 'Eastside',
    city: 'Los Angeles',
    facilities: ['4DX', 'Premium Lounge', 'Bar']
  },
  {
    id: '4',
    name: 'Royal Picture House',
    location: 'Westside',
    city: 'Los Angeles',
    facilities: ['Dolby Atmos', 'Premium Seating', 'Gourmet Food']
  }
];

export const showtimes: Showtime[] = [
  {
    id: '1',
    movieId: '1',
    theaterId: '1',
    date: '2024-06-15',
    time: '15:30',
    format: '2D',
    price: {
      standard: 12,
      premium: 18,
      vip: 24
    }
  },
  {
    id: '2',
    movieId: '1',
    theaterId: '1',
    date: '2024-06-15',
    time: '18:00',
    format: 'IMAX',
    price: {
      standard: 16,
      premium: 22,
      vip: 28
    }
  },
  {
    id: '3',
    movieId: '1',
    theaterId: '2',
    date: '2024-06-15',
    time: '20:15',
    format: '2D',
    price: {
      standard: 14,
      premium: 20,
      vip: 26
    }
  },
  {
    id: '4',
    movieId: '2',
    theaterId: '1',
    date: '2024-06-15',
    time: '16:45',
    format: '3D',
    price: {
      standard: 14,
      premium: 20,
      vip: 26
    }
  },
  {
    id: '5',
    movieId: '2',
    theaterId: '2',
    date: '2024-06-15',
    time: '19:30',
    format: 'IMAX',
    price: {
      standard: 18,
      premium: 24,
      vip: 30
    }
  },
  {
    id: '6',
    movieId: '3',
    theaterId: '3',
    date: '2024-06-15',
    time: '17:15',
    format: '2D',
    price: {
      standard: 13,
      premium: 19,
      vip: 25
    }
  }
];

export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    bookings: []
  }
];

export const generateSeatingPlan = (rows: number, seatsPerRow: number): Seat[] => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const seats: Seat[] = [];
  
  for (let i = 0; i < rows; i++) {
    const row = alphabet[i];
    for (let j = 1; j <= seatsPerRow; j++) {
      let type: 'standard' | 'premium' | 'vip' = 'standard';
      
      // First 2 rows are standard
      if (i < 2) {
        type = 'standard';
      } 
      // Middle rows are premium
      else if (i >= 2 && i < rows - 2) {
        type = 'premium';
      } 
      // Last 2 rows are VIP
      else {
        type = 'vip';
      }
      
      seats.push({
        id: `${row}${j}`,
        row,
        number: j,
        type,
        isBooked: Math.random() < 0.3, // 30% chance of being booked
      });
    }
  }
  
  return seats;
};

export const getMovieById = (id: string): Movie | undefined => {
  return movies.find(movie => movie.id === id);
};

export const getTheaterById = (id: string): Theater | undefined => {
  return theaters.find(theater => theater.id === id);
};

export const getShowtimeById = (id: string): Showtime | undefined => {
  return showtimes.find(showtime => showtime.id === id);
};

export const getShowtimesByMovieId = (movieId: string): Showtime[] => {
  return showtimes.filter(showtime => showtime.movieId === movieId);
};

export const getShowtimesByTheaterId = (theaterId: string): Showtime[] => {
  return showtimes.filter(showtime => showtime.theaterId === theaterId);
};

export const getShowtimesByMovieAndDate = (movieId: string, date: string): Showtime[] => {
  return showtimes.filter(showtime => showtime.movieId === movieId && showtime.date === date);
};

export const getTheatersByMovie = (movieId: string): Theater[] => {
  const theatersIds = showtimes
    .filter(showtime => showtime.movieId === movieId)
    .map(showtime => showtime.theaterId);
  
  return theaters.filter(theater => theatersIds.includes(theater.id));
};
