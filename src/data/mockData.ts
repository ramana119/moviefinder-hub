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
  available?: boolean;
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
    title: 'RRR',
    posterUrl: 'https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO2brrs0yeF1lgXO.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/z9a3e9d2UIQ2kEiSQdFbmGMZ4hx.jpg',
    releaseDate: '2022-03-24',
    duration: '3h 7m',
    genre: ['Action', 'Drama', 'Historical'],
    language: 'Telugu',
    rating: 8.8,
    description: 'A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country in the 1920s.',
    trailerUrl: 'https://www.youtube.com/embed/f_vbAtFSEc0',
    cast: [
      { name: 'Ram Charan', character: 'Alluri Sitarama Raju', photoUrl: 'https://image.tmdb.org/t/p/w200/x7IhU18FFYxFtfHEEiUZr7XJeYS.jpg' },
      { name: 'Jr NTR', character: 'Komaram Bheem', photoUrl: 'https://image.tmdb.org/t/p/w200/npyNwFu3I3BRIjkQJpyJRZnU087.jpg' },
      { name: 'Alia Bhatt', character: 'Sita', photoUrl: 'https://image.tmdb.org/t/p/w200/6IzFbZ4ZWRXLVlR5yI7v1IvPFz4.jpg' }
    ],
    director: 'S.S. Rajamouli',
    format: ['2D', 'IMAX', '4DX']
  },
  {
    id: '2',
    title: 'Baahubali: The Beginning',
    posterUrl: 'https://image.tmdb.org/t/p/w500/9BAjt8nC0zUz9DqO2aFgvXkQhzN.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/zLX1wMzP7XjLAwzUBeOuVGFhprg.jpg',
    releaseDate: '2015-07-10',
    duration: '2h 39m',
    genre: ['Action', 'Adventure', 'Drama'],
    language: 'Telugu',
    rating: 8.1,
    description: 'In ancient India, an adventurous and daring man becomes involved in a decades-old feud between two warring peoples.',
    trailerUrl: 'https://www.youtube.com/embed/sOEg_YZQsTI',
    cast: [
      { name: 'Prabhas', character: 'Shivudu/Baahubali', photoUrl: 'https://image.tmdb.org/t/p/w200/dDn4Qm9uFdMjbJAoOYJzCzzUdJc.jpg' },
      { name: 'Rana Daggubati', character: 'Bhallaladeva', photoUrl: 'https://image.tmdb.org/t/p/w200/cCmPi0s5FVswQQwSWYQr9D1Xka4.jpg' },
      { name: 'Anushka Shetty', character: 'Devasena', photoUrl: 'https://image.tmdb.org/t/p/w200/vu91MnuQoYpHF660tdEDN3taBR6.jpg' }
    ],
    director: 'S.S. Rajamouli',
    format: ['2D', 'IMAX']
  },
  {
    id: '3',
    title: 'Pushpa: The Rise',
    posterUrl: 'https://image.tmdb.org/t/p/w500/m9CN7a1bk1TtmQRwAQxdwDG0jl.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/5hTK0J9SGPQvxqXWjcGalrjBJEj.jpg',
    releaseDate: '2021-12-17',
    duration: '2h 59m',
    genre: ['Action', 'Crime', 'Thriller'],
    language: 'Telugu',
    rating: 7.6,
    description: 'A laborer rises through the ranks of a red sandalwood smuggling syndicate, making enemies along the way.',
    trailerUrl: 'https://www.youtube.com/embed/pKctjlxbFDQ',
    cast: [
      { name: 'Allu Arjun', character: 'Pushpa Raj', photoUrl: 'https://image.tmdb.org/t/p/w200/ypq3WfKKSAJx5LpSPVKqAUKMfJT.jpg' },
      { name: 'Rashmika Mandanna', character: 'Srivalli', photoUrl: 'https://image.tmdb.org/t/p/w200/jHWkYWv3LX4DB48pOfdcMiDnUZP.jpg' },
      { name: 'Fahadh Faasil', character: 'Bhanwar Singh Shekhawat', photoUrl: 'https://image.tmdb.org/t/p/w200/stIgcCQzJeUAVZZj8MlT2Bb5j7h.jpg' }
    ],
    director: 'Sukumar',
    format: ['2D', 'IMAX']
  },
  {
    id: '4',
    title: 'Sita Ramam',
    posterUrl: 'https://image.tmdb.org/t/p/w500/jvKLBfWKQpvISAfzX7JUFhvj2WN.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/etQEGAn9elqFG5sVVMc9QelJ7NW.jpg',
    releaseDate: '2022-08-05',
    duration: '2h 43m',
    genre: ['Romance', 'Drama', 'Historical'],
    language: 'Telugu',
    rating: 8.5,
    description: 'An orphaned soldier\'s life changes when he receives a letter from a girl named Sita. He meets her and love blossoms between them.',
    trailerUrl: 'https://www.youtube.com/embed/QF-Y4Y-5b4w',
    cast: [
      { name: 'Dulquer Salmaan', character: 'Ram', photoUrl: 'https://image.tmdb.org/t/p/w200/oqZ5L3RxJOJ3D2Ns074KGHh6Jkt.jpg' },
      { name: 'Mrunal Thakur', character: 'Sita', photoUrl: 'https://image.tmdb.org/t/p/w200/qhJZzaMLpPlmkN8uLWhYknVOkqr.jpg' },
      { name: 'Rashmika Mandanna', character: 'Afreen', photoUrl: 'https://image.tmdb.org/t/p/w200/jHWkYWv3LX4DB48pOfdcMiDnUZP.jpg' }
    ],
    director: 'Hanu Raghavapudi',
    format: ['2D']
  },
  {
    id: '5',
    title: 'Kantara',
    posterUrl: 'https://image.tmdb.org/t/p/w500/ps3JdEYXpeSDJXL7S3mDe0Tgs4T.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/1rO1FxlZ47k9WL9CgJ1cWB88lTz.jpg',
    releaseDate: '2022-09-30',
    duration: '2h 30m',
    genre: ['Action', 'Adventure', 'Thriller'],
    language: 'Kannada',
    rating: 8.0,
    description: 'A conflict erupts between a village\'s guardians and evil forces. The deity\'s representative faces challenges that redefine his existence.',
    trailerUrl: 'https://www.youtube.com/embed/ppYoIoW73PI',
    cast: [
      { name: 'Rishab Shetty', character: 'Shiva/Kaadubettu Shiva', photoUrl: 'https://image.tmdb.org/t/p/w200/aGNcWQbQT7lfXRXILz6oDTSoXUQ.jpg' },
      { name: 'Sapthami Gowda', character: 'Leela', photoUrl: 'https://image.tmdb.org/t/p/w200/oNQYLmm8iZCjLlKPKaBMQHAR78U.jpg' },
      { name: 'Kishore', character: 'Muralidhar', photoUrl: 'https://image.tmdb.org/t/p/w200/uKqVPvBX5ZUjnRfB6H6VcXvxQJS.jpg' }
    ],
    director: 'Rishab Shetty',
    format: ['2D']
  },
  {
    id: '6',
    title: 'KGF: Chapter 2',
    posterUrl: 'https://image.tmdb.org/t/p/w500/qUUfTmpDxf3zG6Od7RZ4i7EIR09.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/tqcSehEef9wZZvk5K8BmSKKvY6u.jpg',
    releaseDate: '2022-04-14',
    duration: '2h 48m',
    genre: ['Action', 'Drama', 'Thriller'],
    language: 'Kannada',
    rating: 8.3,
    description: 'Rocky takes control of the Kolar Gold Fields and his newfound power makes him the target of people who want to bring him down at any cost.',
    trailerUrl: 'https://www.youtube.com/embed/JKa05nyUmuQ',
    cast: [
      { name: 'Yash', character: 'Rocky', photoUrl: 'https://image.tmdb.org/t/p/w200/uBhCXvu0cLjnCacXbSJV6mrZCWH.jpg' },
      { name: 'Srinidhi Shetty', character: 'Reena', photoUrl: 'https://image.tmdb.org/t/p/w200/xuaAXJbYEIJOsYJUwYUQoZG5mUt.jpg' },
      { name: 'Sanjay Dutt', character: 'Adheera', photoUrl: 'https://image.tmdb.org/t/p/w200/e2pfhsraKvEPmQV1NlbNFp9LZcL.jpg' }
    ],
    director: 'Prashanth Neel',
    format: ['2D', 'IMAX']
  },
  {
    id: '7',
    title: 'Arjun Reddy',
    posterUrl: 'https://image.tmdb.org/t/p/w500/1VV9TcA9oQfkVTFAcOZivVWTFdJ.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/kHNvXUBN5oidxDgEZBEyVHHaCZD.jpg',
    releaseDate: '2017-08-25',
    duration: '2h 47m',
    genre: ['Romance', 'Drama'],
    language: 'Telugu',
    rating: 7.9,
    description: 'A short-tempered house surgeon gets used to drugs and drinks when his girlfriend is forced to marry another person.',
    trailerUrl: 'https://www.youtube.com/embed/aozErj9NqeE',
    cast: [
      { name: 'Vijay Deverakonda', character: 'Arjun Reddy', photoUrl: 'https://image.tmdb.org/t/p/w200/5uKJJ5PimV5hDgKxnYc4QYX2eVL.jpg' },
      { name: 'Shalini Pandey', character: 'Preethi', photoUrl: 'https://image.tmdb.org/t/p/w200/c6xT3XHmSnMjt4El5LoRCJq04Xc.jpg' },
      { name: 'Rahul Ramakrishna', character: 'Shiva', photoUrl: 'https://image.tmdb.org/t/p/w200/dQCviTDm4XxXFfKc0BsEycGiQZe.jpg' }
    ],
    director: 'Sandeep Vanga',
    format: ['2D']
  },
  {
    id: '8',
    title: 'Bahubali 2: The Conclusion',
    posterUrl: 'https://image.tmdb.org/t/p/w500/21sC2assImJ7CrT5MuTJNMfAIGD.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/5lAMQMWpXMsirvtLLvW7cJgEPkU.jpg',
    releaseDate: '2017-04-28',
    duration: '2h 47m',
    genre: ['Action', 'Adventure', 'Drama'],
    language: 'Telugu',
    rating: 8.4,
    description: 'After learning that his father was brutally killed by Bhallaladeva, Mahendra Baahubali raises an army to defeat him and release his mother from the former\'s captivity.',
    trailerUrl: 'https://www.youtube.com/embed/G62HrubdD6o',
    cast: [
      { name: 'Prabhas', character: 'Amarendra Baahubali/Mahendra Baahubali', photoUrl: 'https://image.tmdb.org/t/p/w200/dDn4Qm9uFdMjbJAoOYJzCzzUdJc.jpg' },
      { name: 'Rana Daggubati', character: 'Bhallaladeva', photoUrl: 'https://image.tmdb.org/t/p/w200/cCmPi0s5FVswQQwSWYQr9D1Xka4.jpg' },
      { name: 'Anushka Shetty', character: 'Devasena', photoUrl: 'https://image.tmdb.org/t/p/w200/vu91MnuQoYpHF660tdEDN3taBR6.jpg' }
    ],
    director: 'S.S. Rajamouli',
    format: ['2D', 'IMAX']
  },
  {
    id: '9',
    title: 'Jersey',
    posterUrl: 'https://image.tmdb.org/t/p/w500/yXrLCgtZUlMVoLmqLzTHzNX0H0f.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/7Tx15J6PRRoOsZ01lFX1sxJMJLJ.jpg',
    releaseDate: '2019-04-19',
    duration: '2h 40m',
    genre: ['Drama', 'Sport'],
    language: 'Telugu',
    rating: 8.2,
    description: 'A failed cricketer decides to revive his career in his late thirties to fulfill his son\'s wish for a jersey as a gift.',
    trailerUrl: 'https://www.youtube.com/embed/AjAe_Q1WZ_8',
    cast: [
      { name: 'Nani', character: 'Arjun', photoUrl: 'https://image.tmdb.org/t/p/w200/aSbdKRB5nTyq8YUtyh6ZVkQICC6.jpg' },
      { name: 'Shraddha Srinath', character: 'Sarah', photoUrl: 'https://image.tmdb.org/t/p/w200/6Y6ZHm9siwhWK4fVK11T2f2HKjG.jpg' },
      { name: 'Ronit Kamra', character: 'Nani', photoUrl: 'https://image.tmdb.org/t/p/w200/xE1NXpuEbJyRRXH5qVBLLUyXOJr.jpg' }
    ],
    director: 'Gowtam Tinnanuri',
    format: ['2D']
  },
  {
    id: '10',
    title: 'Rangasthalam',
    posterUrl: 'https://image.tmdb.org/t/p/w500/2lhkKz31tQjw1TRccd5IgxrEWT4.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/fpsdWgGydPJ1a1WhLl7YNKLfL2.jpg',
    releaseDate: '2018-03-30',
    duration: '2h 59m',
    genre: ['Action', 'Drama', 'Thriller'],
    language: 'Telugu',
    rating: 8.3,
    description: 'Chitti Babu, a partially deaf man, lives in a village called Rangasthalam and falls in love with Lakshmi. When his brother decides to contest in local body elections against the local strongman, events take a violent turn.',
    trailerUrl: 'https://www.youtube.com/embed/cE0eTF32k1c',
    cast: [
      { name: 'Ram Charan', character: 'Chitti Babu', photoUrl: 'https://image.tmdb.org/t/p/w200/x7IhU18FFYxFtfHEEiUZr7XJeYS.jpg' },
      { name: 'Samantha Ruth Prabhu', character: 'Ramalakshmi', photoUrl: 'https://image.tmdb.org/t/p/w200/ej1fYd2CePYnAEbLGRFnmCGIH3Y.jpg' },
      { name: 'Aadhi Pinisetty', character: 'Kumar Babu', photoUrl: 'https://image.tmdb.org/t/p/w200/tOmDvUdSzxYVdNk1g4Zde7e6WLQ.jpg' }
    ],
    director: 'Sukumar',
    format: ['2D']
  }
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
    },
    available: true
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
    },
    available: true
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
    },
    available: false
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
    },
    available: true
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
    },
    available: true
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
    },
    available: true
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
