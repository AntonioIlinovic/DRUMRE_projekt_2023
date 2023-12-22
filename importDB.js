import { initializeApp } from 'firebase/app';
import { getFirestore, collection, setDoc, doc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA3IttEIo6xfRsCGDiMsEpOnAJs94alo00",
    authDomain: "drumre-15d77.firebaseapp.com",
    projectId: "drumre-15d77",
    storageBucket: "drumre-15d77.appspot.com",
    messagingSenderId: "91050764028",
    appId: "1:91050764028:web:d86960424bb76444b09979",
    databaseURL: "https://drumre-15d77-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const APIKEY = '7ed9cecf1c8468086891b0434dfa7e1e';
const MOVIES_TO_FETCH = 1000;
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