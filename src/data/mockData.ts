
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
  available: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  verified: boolean;
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
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BODUwNDNjYzctODUxNy00ZTA2LWIyYTEtMDc5Y2E5ZjBmNTMzXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg',
    backdropUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/rrr-et00094579-29-03-2022-02-15-44.jpg',
    releaseDate: '2022-03-24',
    duration: '3h 7m',
    genre: ['Action', 'Drama', 'Historical'],
    language: 'Telugu',
    rating: 8.8,
    description: 'A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country in the 1920s.',
    trailerUrl: 'https://www.youtube.com/embed/f_vbAtFSEc0',
    cast: [
      { name: 'Ram Charan', character: 'Alluri Sitarama Raju', photoUrl: 'https://m.media-amazon.com/images/M/MV5BOGVkMmE4ZGUtNDY5Mi00MjQ2LWEyM2UtZWM1NjRhODdkMmU3XkEyXkFqcGdeQXVyMTUyNjIwMDEw._V1_.jpg' },
      { name: 'Jr NTR', character: 'Komaram Bheem', photoUrl: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/jr-ntr-15411-19-09-2017-01-52-16.jpg' },
      { name: 'Alia Bhatt', character: 'Sita', photoUrl: 'https://m.media-amazon.com/images/M/MV5BMTczNTg5NTgwNF5BMl5BanBnXkFtZTgwMjQ4NTU0MDI@._V1_.jpg' }
    ],
    director: 'S.S. Rajamouli',
    format: ['2D', 'IMAX', '4DX']
  },
  {
    id: '2',
    title: 'Baahubali: The Beginning',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BYWVlMjVhZWYtNWViNC00ODFkLTk1MmItYjU1MDY5ZDdhMTU3XkEyXkFqcGdeQXVyODIwMDI1NjM@._V1_.jpg',
    backdropUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/baahubali-the-beginning-et00030374-16-07-2021-02-55-09.jpg',
    releaseDate: '2015-07-10',
    duration: '2h 39m',
    genre: ['Action', 'Adventure', 'Drama'],
    language: 'Telugu',
    rating: 8.1,
    description: 'In ancient India, an adventurous and daring man becomes involved in a decades-old feud between two warring peoples.',
    trailerUrl: 'https://www.youtube.com/embed/sOEg_YZQsTI',
    cast: [
      { name: 'Prabhas', character: 'Shivudu/Baahubali', photoUrl: 'https://m.media-amazon.com/images/M/MV5BMTcwNzYzMTkwMl5BMl5BanBnXkFtZTgwMjE2MjAzMzE@._V1_.jpg' },
      { name: 'Rana Daggubati', character: 'Bhallaladeva', photoUrl: 'https://m.media-amazon.com/images/M/MV5BMjE2NDcwOTIyNl5BMl5BanBnXkFtZTgwOTQ4NTI0NDE@._V1_.jpg' },
      { name: 'Anushka Shetty', character: 'Devasena', photoUrl: 'https://m.media-amazon.com/images/M/MV5BMTY5NjkwNTU2MF5BMl5BanBnXkFtZTgwMDc2MjY5NTE@._V1_.jpg' }
    ],
    director: 'S.S. Rajamouli',
    format: ['2D', 'IMAX']
  },
  {
    id: '3',
    title: 'Pushpa: The Rise',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/7/75/Pushpa_-_The_Rise_%282021_film%29.jpg',
    backdropUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/pushpa--the-rise-et00129538-08-12-2021-01-21-46.jpg',
    releaseDate: '2021-12-17',
    duration: '2h 59m',
    genre: ['Action', 'Crime', 'Thriller'],
    language: 'Telugu',
    rating: 7.6,
    description: 'A laborer rises through the ranks of a red sandalwood smuggling syndicate, making enemies along the way.',
    trailerUrl: 'https://www.youtube.com/embed/pKctjlxbFDQ',
    cast: [
      { name: 'Allu Arjun', character: 'Pushpa Raj', photoUrl: 'https://m.media-amazon.com/images/M/MV5BZWMyMjA1N2UtOTdjNi00ZGQ2LWIzNzQtMTE0ZjRkOTRmMGZlXkEyXkFqcGdeQXVyMTUyNjIwMDEw._V1_FMjpg_UX1000_.jpg' },
      { name: 'Rashmika Mandanna', character: 'Srivalli', photoUrl: 'https://m.media-amazon.com/images/M/MV5BNDk3MWI5ZGQtNTNhMC00NGY4LThjZWEtYmI1ZmVkYTU4N2JiXkEyXkFqcGdeQXVyMTUyNjIwMDEw._V1_.jpg' },
      { name: 'Fahadh Faasil', character: 'Bhanwar Singh Shekhawat', photoUrl: 'https://m.media-amazon.com/images/M/MV5BMTQxMTgyNDc5OF5BMl5BanBnXkFtZTcwMjY5NzMxOA@@._V1_.jpg' }
    ],
    director: 'Sukumar',
    format: ['2D', 'IMAX']
  },
  {
    id: '4',
    title: 'Sita Ramam',
    posterUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/sita-ramam-et00329656-1658987945.jpg',
    backdropUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/sita-ramam-et00329656-1658987945.jpg',
    releaseDate: '2022-08-05',
    duration: '2h 43m',
    genre: ['Romance', 'Drama', 'Historical'],
    language: 'Telugu',
    rating: 8.5,
    description: 'An orphaned soldier\'s life changes when he receives a letter from a girl named Sita. He meets her and love blossoms between them.',
    trailerUrl: 'https://www.youtube.com/embed/QF-Y4Y-5b4w',
    cast: [
      { name: 'Dulquer Salmaan', character: 'Ram', photoUrl: 'https://m.media-amazon.com/images/M/MV5BM2IxNGRkMTgtYTI5OS00Y2FiLTgyNmUtYzRkZmYzZTVjNzdkXkEyXkFqcGdeQXVyMTMxODA4Njgx._V1_FMjpg_UX1000_.jpg' },
      { name: 'Mrunal Thakur', character: 'Sita', photoUrl: 'https://m.media-amazon.com/images/M/MV5BMWEwMzQwY2ItNDFiOS00YWVlLTllYzMtN2U5MTg3ZGNjODRlXkEyXkFqcGdeQXVyMTMxMTIwMTE0._V1_.jpg' },
      { name: 'Rashmika Mandanna', character: 'Afreen', photoUrl: 'https://m.media-amazon.com/images/M/MV5BNDk3MWI5ZGQtNTNhMC00NGY4LThjZWEtYmI1ZmVkYTU4N2JiXkEyXkFqcGdeQXVyMTUyNjIwMDEw._V1_.jpg' }
    ],
    director: 'Hanu Raghavapudi',
    format: ['2D']
  },
  {
    id: '5',
    title: 'Kantara',
    posterUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/kantara-hindi-et00342025-1665304124.jpg',
    backdropUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/kantara-hindi-et00342025-1665304124.jpg',
    releaseDate: '2022-09-30',
    duration: '2h 30m',
    genre: ['Action', 'Adventure', 'Thriller'],
    language: 'Kannada',
    rating: 8.0,
    description: 'A conflict erupts between a village\'s guardians and evil forces. The deity\'s representative faces challenges that redefine his existence.',
    trailerUrl: 'https://www.youtube.com/embed/ppYoIoW73PI',
    cast: [
      { name: 'Rishab Shetty', character: 'Shiva/Kaadubettu Shiva', photoUrl: 'https://m.media-amazon.com/images/M/MV5BNjRiYTcxM2UtMTExYy00NTU0LWFiMDgtMDI2N2UyODczZTQ0XkEyXkFqcGdeQXVyMTU0ODI1NTA2._V1_.jpg' },
      { name: 'Sapthami Gowda', character: 'Leela', photoUrl: 'https://m.media-amazon.com/images/M/MV5BNWYyYzFiZWMtNzk4OS00OGI5LWIyZTktMDg2ZmJiNmRiZWJhXkEyXkFqcGdeQXVyMTQyOTU3OTMx._V1_.jpg' },
      { name: 'Kishore', character: 'Muralidhar', photoUrl: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/kishore-kumar-g-2138-1646127415.jpg' }
    ],
    director: 'Rishab Shetty',
    format: ['2D']
  },
  {
    id: '6',
    title: 'KGF: Chapter 2',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjMwNDI0NjQ3OV5BMl5BanBnXkFtZTgwNTI4MDk5NjM@._V1_.jpg',
    backdropUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/kgf-chapter-2-et00098647-08-04-2022-11-33-32.jpg',
    releaseDate: '2022-04-14',
    duration: '2h 48m',
    genre: ['Action', 'Drama', 'Thriller'],
    language: 'Kannada',
    rating: 8.3,
    description: 'Rocky takes control of the Kolar Gold Fields and his newfound power makes him the target of people who want to bring him down at any cost.',
    trailerUrl: 'https://www.youtube.com/embed/JKa05nyUmuQ',
    cast: [
      { name: 'Yash', character: 'Rocky', photoUrl: 'https://m.media-amazon.com/images/M/MV5BMjI0MTgxMjI0Ml5BMl5BanBnXkFtZTgwMTk5ODk3NTE@._V1_.jpg' },
      { name: 'Srinidhi Shetty', character: 'Reena', photoUrl: 'https://m.media-amazon.com/images/M/MV5BZjM5YWRjYzktYWFkZC00Zjc5LWJlMjYtNGI1NmFiMWNjMTAzXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_.jpg' },
      { name: 'Sanjay Dutt', character: 'Adheera', photoUrl: 'https://m.media-amazon.com/images/M/MV5BNTNhN2FkZDctYWQwOC00YTYzLWJmZDUtZDAwZDVhMjA0ZDI0XkEyXkFqcGdeQXVyMTExNDQ2MTI@._V1_FMjpg_UX1000_.jpg' }
    ],
    director: 'Prashanth Neel',
    format: ['2D', 'IMAX']
  },
  {
    id: '7',
    title: 'Arjun Reddy',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNzk4NmRiNmQtNWU5ZC00ZWU4LTk3NTQtYzg3NjMzYjNkOGZkXkEyXkFqcGdeQXVyNzEwNjg3MjU@._V1_.jpg',
    backdropUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/arjun-reddy-et00056735-25-10-2017-08-23-20.jpg',
    releaseDate: '2017-08-25',
    duration: '2h 47m',
    genre: ['Romance', 'Drama'],
    language: 'Telugu',
    rating: 7.9,
    description: 'A short-tempered house surgeon gets used to drugs and drinks when his girlfriend is forced to marry another person.',
    trailerUrl: 'https://www.youtube.com/embed/aozErj9NqeE',
    cast: [
      { name: 'Vijay Deverakonda', character: 'Arjun Reddy', photoUrl: 'https://m.media-amazon.com/images/M/MV5BMTc5ZTRjZWYtNGY3ZS00M2M0LWIzOTAtMTRjNTVkMzc3MWI3XkEyXkFqcGdeQXVyNDY5MTUyNjU@._V1_.jpg' },
      { name: 'Shalini Pandey', character: 'Preethi', photoUrl: 'https://m.media-amazon.com/images/M/MV5BNGIxZWVjNGYtYzNjOS00MmNjLTlkNjctMjcwMTMwOWFmYjNkXkEyXkFqcGdeQXVyMzYxOTQ3MDg@._V1_.jpg' },
      { name: 'Rahul Ramakrishna', character: 'Shiva', photoUrl: 'https://m.media-amazon.com/images/M/MV5BMGI5NzFkMWUtODBkYi00NDliLTlkMzAtYTQzYTcwNDUxMTgyXkEyXkFqcGdeQXVyMjkxNzQ1NDI@._V1_.jpg' }
    ],
    director: 'Sandeep Vanga',
    format: ['2D']
  },
  {
    id: '8',
    title: 'Bahubali 2: The Conclusion',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BOGNlNmRkMjctNDgxMC00NzFhLWIzY2YtZDk3ZDE0NWZhZDBlXkEyXkFqcGdeQXVyODIwMDI1NjM@._V1_.jpg',
    backdropUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/baahubali-2-the-conclusion-et00038693-12-11-2020-11-35-00.jpg',
    releaseDate: '2017-04-28',
    duration: '2h 47m',
    genre: ['Action', 'Adventure', 'Drama'],
    language: 'Telugu',
    rating: 8.4,
    description: 'After learning that his father was brutally killed by Bhallaladeva, Mahendra Baahubali raises an army to defeat him and release his mother from the former\'s captivity.',
    trailerUrl: 'https://www.youtube.com/embed/G62HrubdD6o',
    cast: [
      { name: 'Prabhas', character: 'Amarendra Baahubali/Mahendra Baahubali', photoUrl: 'https://m.media-amazon.com/images/M/MV5BMTcwNzYzMTkwMl5BMl5BanBnXkFtZTgwMjE2MjAzMzE@._V1_.jpg' },
      { name: 'Rana Daggubati', character: 'Bhallaladeva', photoUrl: 'https://m.media-amazon.com/images/M/MV5BMjE2NDcwOTIyNl5BMl5BanBnXkFtZTgwOTQ4NTI0NDE@._V1_.jpg' },
      { name: 'Anushka Shetty', character: 'Devasena', photoUrl: 'https://m.media-amazon.com/images/M/MV5BMTY5NjkwNTU2MF5BMl5BanBnXkFtZTgwMDc2MjY5NTE@._V1_.jpg' }
    ],
    director: 'S.S. Rajamouli',
    format: ['2D', 'IMAX']
  },
  {
    id: '9',
    title: 'Jersey',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkxNzQ1NDI@._V1_.jpg',
    backdropUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/jersey-et00137318-04-12-2020-07-24-28.jpg',
    releaseDate: '2019-04-19',
    duration: '2h 40m',
    genre: ['Drama', 'Sport'],
    language: 'Telugu',
    rating: 8.2,
    description: 'A failed cricketer decides to revive his career in his late thirties to fulfill his son\'s wish for a jersey as a gift.',
    trailerUrl: 'https://www.youtube.com/embed/AjAe_Q1WZ_8',
    cast: [
      { name: 'Nani', character: 'Arjun', photoUrl: 'https://m.media-amazon.com/images/M/MV5BMTA5OTY5OTkxNjZeQTJeQWpwZ15BbWU4MDg5MzIyNTIz._V1_FMjpg_UX1000_.jpg' },
      { name: 'Shraddha Srinath', character: 'Sarah', photoUrl: 'https://m.media-amazon.com/images/M/MV5BYmYxYjAxMGUtOTJlYi00M2Y0LThiMWMtMGY0YzM4MDZjMzYzXkEyXkFqcGdeQXVyMzYxOTQ3MDg@._V1_.jpg' },
      { name: 'Ronit Kamra', character: 'Nani', photoUrl: 'https://m.media-amazon.com/images/M/MV5BOTJhZGU2MDAtMDkxYS00NzFjLWIzMTktMTRmOWI0NjliODgyXkEyXkFqcGdeQXVyMzYxOTQ3MDg@._V1_.jpg' }
    ],
    director: 'Gowtam Tinnanuri',
    format: ['2D']
  },
  {
    id: '10',
    title: 'Rangasthalam',
    posterUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/rangasthalam-et00061162-19-04-2018-11-08-00.jpg',
    backdropUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/rangasthalam-et00061162-19-04-2018-11-08-00.jpg',
    releaseDate: '2018-03-30',
    duration: '2h 59m',
    genre: ['Action', 'Drama', 'Thriller'],
    language: 'Telugu',
    rating: 8.3,
    description: 'Chitti Babu, a partially deaf man, lives in a village called Rangasthalam and falls in love with Lakshmi. When his brother decides to contest in local body elections against the local strongman, events take a violent turn.',
    trailerUrl: 'https://www.youtube.com/embed/cE0eTF32k1c',
    cast: [
      { name: 'Ram Charan', character: 'Chitti Babu', photoUrl: 'https://m.media-amazon.com/images/M/MV5BOGVkMmE4ZGUtNDY5Mi00MjQ2LWEyM2UtZWM1NjRhODdkMmU3XkEyXkFqcGdeQXVyMTUyNjIwMDEw._V1_.jpg' },
      { name: 'Samantha Ruth Prabhu', character: 'Ramalakshmi', photoUrl: 'https://m.media-amazon.com/images/M/MV5BMTg5NjY3NzctZjUzNS00ZGE4LWI3NDgtZDFiYzY0YWQzYTcxXkEyXkFqcGdeQXVyMzYxOTQ3MDg@._V1_.jpg' },
      { name: 'Aadhi Pinisetty', character: 'Kumar Babu', photoUrl: 'https://m.media-amazon.com/images/M/MV5BNzY0ZWExMzEtMDM4NC00NjUwLWJiYjMtZmM0MWI5NTJjYTAwXkEyXkFqcGdeQXVyMzYxOTQ3MDg@._V1_.jpg' }
    ],
    director: 'Sukumar',
    format: ['2D']
  },
  {
    id: '11',
    title: 'Ala Vaikunthapurramuloo',
    posterUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/ala-vaikunthapurramuloo-et00118191-13-01-2020-09-18-14.jpg',
    backdropUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/ala-vaikunthapurramuloo-et00118191-13-01-2020-09-18-14.jpg',
    releaseDate: '2020-01-12',
    duration: '2h 45m',
    genre: ['Action', 'Comedy', 'Drama'],
    language: 'Telugu',
    rating: 7.7,
    description: 'Bantu grows up being constantly subjected to his father\'s scorn. However, when he learns of his real parentage, he decides to carve a place for himself within the family he truly belongs to.',
    trailerUrl: 'https://www.youtube.com/embed/SkENAjfVoFI',
    cast: [
      { name: 'Allu Arjun', character: 'Bantu', photoUrl: 'https://m.media-amazon.com/images/M/MV5BZWMyMjA1N2UtOTdjNi00ZGQ2LWIzNzQtMTE0ZjRkOTRmMGZlXkEyXkFqcGdeQXVyMTUyNjIwMDEw._V1_FMjpg_UX1000_.jpg' },
      { name: 'Pooja Hegde', character: 'Amulya', photoUrl: 'https://m.media-amazon.com/images/M/MV5BZmQ3Mzg0Y2YtYzdkZC00MWM2LTgxNDMtYjFhMGNhOWRlNDQ5XkEyXkFqcGdeQXVyMjkxNzQ1NDI@._V1_.jpg' },
      { name: 'Tabu', character: 'Yashoda', photoUrl: 'https://m.media-amazon.com/images/M/MV5BNDkzNzIyOTk5OF5BMl5BanBnXkFtZTgwNzc4OTE1MDI@._V1_.jpg' }
    ],
    director: 'Trivikram Srinivas',
    format: ['2D']
  },
  {
    id: '12',
    title: 'Mahanati',
    posterUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/mahanati-et00073533-16-10-2017-10-17-23.jpg',
    backdropUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/mahanati-et00073533-16-10-2017-10-17-23.jpg',
    releaseDate: '2018-05-09',
    duration: '2h 57m',
    genre: ['Biography', 'Drama'],
    language: 'Telugu',
    rating: 8.6,
    description: 'The life of actress Savitri, a colorful personality full of heart, who ruled the Telugu and Tamil film industry for two decades during the \'50s and \'60s.',
    trailerUrl: 'https://www.youtube.com/embed/PLmBpf7UHJs',
    cast: [
      { name: 'Keerthy Suresh', character: 'Savitri', photoUrl: 'https://m.media-amazon.com/images/M/MV5BOGM3MzIwMjktYWJiYy00ZGRkLWIxODMtMTM5MWEzY2M0ODg2XkEyXkFqcGdeQXVyNDA5ODU0NDg@._V1_.jpg' },
      { name: 'Dulquer Salmaan', character: 'Gemini Ganesan', photoUrl: 'https://m.media-amazon.com/images/M/MV5BM2IxNGRkMTgtYTI5OS00Y2FiLTgyNmUtYzRkZmYzZTVjNzdkXkEyXkFqcGdeQXVyMTMxODA4Njgx._V1_FMjpg_UX1000_.jpg' },
      { name: 'Samantha Ruth Prabhu', character: 'Madhuravani', photoUrl: 'https://m.media-amazon.com/images/M/MV5BMTg5NjY3NzctZjUzNS00ZGE4LWI3NDgtZDFiYzY0YWQzYTcxXkEyXkFqcGdeQXVyMzYxOTQ3MDg@._V1_.jpg' }
    ],
    director: 'Nag Ashwin',
    format: ['2D']
  }
];

export const theaters: Theater[] = [
  {
    id: '1',
    name: 'PVR Cinemas',
    location: 'Banjara Hills',
    city: 'Hyderabad',
    facilities: ['Dolby Atmos', 'Recliner Seats', 'Food Service']
  },
  {
    id: '2',
    name: 'INOX Movies',
    location: 'Gachibowli',
    city: 'Hyderabad',
    facilities: ['IMAX Screen', 'Premium Sound', 'Lounge']
  },
  {
    id: '3',
    name: 'AMB Cinemas',
    location: 'Jubilee Hills',
    city: 'Hyderabad',
    facilities: ['4DX', 'Premium Lounge', 'Bar']
  },
  {
    id: '4',
    name: 'Prasads Multiplex',
    location: 'Necklace Road',
    city: 'Hyderabad',
    facilities: ['Dolby Atmos', 'Premium Seating', 'IMAX']
  },
  {
    id: '5',
    name: 'PVR ICON',
    location: 'Whitefield',
    city: 'Bangalore',
    facilities: ['Dolby Atmos', 'Recliner Seats', 'Gold Class']
  },
  {
    id: '6',
    name: 'INOX Garuda',
    location: 'Magrath Road',
    city: 'Bangalore',
    facilities: ['IMAX Screen', 'Premium Sound', 'Lounge']
  },
  {
    id: '7',
    name: 'Cinepolis',
    location: 'Forum Mall',
    city: 'Bangalore',
    facilities: ['4DX', 'VIP Seats', 'Food Court']
  },
  {
    id: '8',
    name: 'Sathyam Cinemas',
    location: 'Royapettah',
    city: 'Chennai',
    facilities: ['Dolby Atmos', 'Luxe Recliners', 'Gourmet Food']
  },
  {
    id: '9',
    name: 'PVR Market City',
    location: 'Velachery',
    city: 'Chennai',
    facilities: ['IMAX Screen', 'Premium Sound', 'Lounge']
  },
  {
    id: '10',
    name: 'INOX Luxe',
    location: 'Phoenix Marketcity',
    city: 'Mumbai',
    facilities: ['4DX', 'Premium Lounge', 'Gourmet Food']
  }
];

export const showtimes: Showtime[] = [
  {
    id: '1',
    movieId: '1',
    theaterId: '1',
    date: '2024-06-15',
    time: '10:30',
    format: '2D',
    price: {
      standard: 180,
      premium: 250,
      vip: 350
    },
    available: true
  },
  {
    id: '2',
    movieId: '1',
    theaterId: '1',
    date: '2024-06-15',
    time: '13:45',
    format: 'IMAX',
    price: {
      standard: 220,
      premium: 320,
      vip: 450
    },
    available: true
  },
  {
    id: '3',
    movieId: '1',
    theaterId: '1',
    date: '2024-06-15',
    time: '17:15',
    format: '2D',
    price: {
      standard: 200,
      premium: 280,
      vip: 380
    },
    available: true
  },
  {
    id: '4',
    movieId: '1',
    theaterId: '1',
    date: '2024-06-15',
    time: '20:30',
    format: '4DX',
    price: {
      standard: 280,
      premium: 380,
      vip: 480
    },
    available: true
  },
  {
    id: '5',
    movieId: '1',
    theaterId: '2',
    date: '2024-06-15',
    time: '11:00',
    format: '2D',
    price: {
      standard: 190,
      premium: 260,
      vip: 360
    },
    available: true
  },
  {
    id: '6',
    movieId: '1',
    theaterId: '2',
    date: '2024-06-15',
    time: '14:30',
    format: 'IMAX',
    price: {
      standard: 240,
      premium: 340,
      vip: 470
    },
    available: true
  },
  {
    id: '7',
    movieId: '1',
    theaterId: '2',
    date: '2024-06-15',
    time: '18:00',
    format: '2D',
    price: {
      standard: 210,
      premium: 290,
      vip: 390
    },
    available: false
  },
  {
    id: '8',
    movieId: '1',
    theaterId: '3',
    date: '2024-06-15',
    time: '10:15',
    format: '2D',
    price: {
      standard: 170,
      premium: 240,
      vip: 340
    },
    available: true
  },
  {
    id: '9',
    movieId: '1',
    theaterId: '3',
    date: '2024-06-15',
    time: '13:30',
    format: '4DX',
    price: {
      standard: 270,
      premium: 370,
      vip: 470
    },
    available: true
  },
  {
    id: '10',
    movieId: '1',
    theaterId: '3',
    date: '2024-06-15',
    time: '16:45',
    format: '2D',
    price: {
      standard: 190,
      premium: 270,
      vip: 370
    },
    available: true
  },
  {
    id: '11',
    movieId: '1',
    theaterId: '3',
    date: '2024-06-15',
    time: '20:00',
    format: 'IMAX',
    price: {
      standard: 240,
      premium: 340,
      vip: 470
    },
    available: true
  },
  // Add more showtimes for other movies in similar pattern
  {
    id: '12',
    movieId: '2',
    theaterId: '1',
    date: '2024-06-15',
    time: '11:30',
    format: '2D',
    price: {
      standard: 180,
      premium: 250,
      vip: 350
    },
    available: true
  },
  {
    id: '13',
    movieId: '2',
    theaterId: '1',
    date: '2024-06-15',
    time: '15:00',
    format: 'IMAX',
    price: {
      standard: 230,
      premium: 330,
      vip: 450
    },
    available: true
  },
  {
    id: '14',
    movieId: '2',
    theaterId: '2',
    date: '2024-06-15',
    time: '12:15',
    format: '2D',
    price: {
      standard: 190,
      premium: 260,
      vip: 360
    },
    available: true
  },
  {
    id: '15',
    movieId: '2',
    theaterId: '2',
    date: '2024-06-15',
    time: '16:30',
    format: 'IMAX',
    price: {
      standard: 240,
      premium: 340,
      vip: 470
    },
    available: true
  },
  {
    id: '16',
    movieId: '2',
    theaterId: '3',
    date: '2024-06-15',
    time: '13:00',
    format: '2D',
    price: {
      standard: 180,
      premium: 260,
      vip: 360
    },
    available: true
  },
  // Add showtimes for more movies
  {
    id: '17',
    movieId: '3',
    theaterId: '1',
    date: '2024-06-15',
    time: '14:00',
    format: '2D',
    price: {
      standard: 180,
      premium: 250,
      vip: 350
    },
    available: true
  },
  {
    id: '18',
    movieId: '3',
    theaterId: '2',
    date: '2024-06-15',
    time: '17:30',
    format: 'IMAX',
    price: {
      standard: 230,
      premium: 330,
      vip: 450
    },
    available: true
  }
];

export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    verified: true,
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

