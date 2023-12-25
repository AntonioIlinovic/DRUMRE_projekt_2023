import { initializeApp } from 'firebase/app';
import { getFirestore, collection, setDoc, doc } from 'firebase/firestore';


// Firebase and TMDB API configuration hrvoje
/*
export const firebaseConfig = {
    apiKey: "AIzaSyA3IttEIo6xfRsCGDiMsEpOnAJs94alo00",
    authDomain: "drumre-15d77.firebaseapp.com",
    projectId: "drumre-15d77",
    storageBucket: "drumre-15d77.appspot.com",
    messagingSenderId: "91050764028",
    appId: "1:91050764028:web:d86960424bb76444b09979",
    databaseURL: "https://drumre-15d77-default-rtdb.europe-west1.firebasedatabase.app/"
};
// API key hrvoje
const APIKEY = '7ed9cecf1c8468086891b0434dfa7e1e';
 */

// Firebase and TMDB API configuration antonio
export const firebaseConfig = {
    apiKey: "AIzaSyA-VRfJouNO5Ncf0IK2sOGvikqACsEgqtE",
    authDomain: "drumre-movies-project.firebaseapp.com",
    databaseURL: "https://drumre-movies-project-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "drumre-movies-project",
    storageBucket: "drumre-movies-project.appspot.com",
    messagingSenderId: "374253317734",
    appId: "1:374253317734:web:3ac85c6438fafaa6af87a7"
};
// API key antonio
export const APIKEY = 'd5287db2785ca177cbb4fd9b9d6cbc9b';


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Number of movies to fetch, for development purposes, keep it low
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