import { initializeApp } from 'firebase/app';
import { getFirestore, collection, setDoc, doc } from 'firebase/firestore';
import { firebaseConfig, APIKEY } from './firebase';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Number of movies to fetch from TMDB. For testing purposes, keep this number low,
// so it doesn't use up Firebase quota
const MOVIES_TO_FETCH = 20;
const MOVIES_PER_PAGE = 20;

const fetchMovies = async (page) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${APIKEY}&page=${page}`
        );
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
};

const saveMovieToFirebase = async (movie) => {
    try {
        // Use collection and doc functions from Firestore
        const movieRef = doc(collection(db, 'movies'), `${movie.id}`);
        await setDoc(movieRef, movie);
    } catch (error) {
        console.error('Error saving movie to Firebase:', error);
    }
};

const fetchAndSaveMovies = async () => {
    const totalPages = Math.ceil(MOVIES_TO_FETCH / MOVIES_PER_PAGE);

    for (let page = 1; page <= totalPages; page++) {
        const movies = await fetchMovies(page);
        for (const movie of movies) {
            await saveMovieToFirebase(movie);
        }
    }

    console.log('Finished fetching and saving movies');
};

// Execute the function
fetchAndSaveMovies();
