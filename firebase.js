import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"; 

const firebaseConfig = {
    apiKey: 'AIzaSyAi0pmXWO6CKTPjwPpgKvn9OhEYdy0-RC8',
    authDomain: 'movies-4378d.firebaseapp.com',
    projectId: 'movies-4378d',
    storageBucket: 'movies-4378d.appspot.com',
    messagingSenderId: '535037281692',
    appId: '1:535037281692:web:7d54821ab3787d6ef3b459'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
