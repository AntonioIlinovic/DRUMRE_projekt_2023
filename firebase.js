import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"; 


// Set the user whose Firebase and TMDB api you want to use
// It can be 'antonio', 'hrvoje' or 'mario'
// Config file for 'mario' needs to be created
const SELECTED_USER_CONFIG = 'antonio';


// Configuration for Firebase database
let firebaseConfig = {};
// Configuration for TMDB API Key
let APIKEY = '';


if (SELECTED_USER_CONFIG === 'antonio') {
    firebaseConfig = {
        apiKey: "AIzaSyA-VRfJouNO5Ncf0IK2sOGvikqACsEgqtE",
        authDomain: "drumre-movies-project.firebaseapp.com",
        databaseURL: "https://drumre-movies-project-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "drumre-movies-project",
        storageBucket: "drumre-movies-project.appspot.com",
        messagingSenderId: "374253317734",
        appId: "1:374253317734:web:3ac85c6438fafaa6af87a7"
    };

    APIKEY = 'd5287db2785ca177cbb4fd9b9d6cbc9b';
} else if (SELECTED_USER_CONFIG === 'hrvoje') {
    firebaseConfig = {
        apiKey: "AIzaSyA3IttEIo6xfRsCGDiMsEpOnAJs94alo00",
        authDomain: "drumre-15d77.firebaseapp.com",
        projectId: "drumre-15d77",
        storageBucket: "drumre-15d77.appspot.com",
        messagingSenderId: "91050764028",
        appId: "1:91050764028:web:d86960424bb76444b09979",
        databaseURL: "https://drumre-15d77-default-rtdb.europe-west1.firebasedatabase.app/"
    };

    APIKEY = '7ed9cecf1c8468086891b0434dfa7e1e';
} else if (SELECTED_USER_CONFIG === 'mario') {
    // TODO - create config file for Mario
}


const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export { firebaseConfig, APIKEY };