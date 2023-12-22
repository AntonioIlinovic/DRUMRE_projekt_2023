import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"; 

// Firebase configuration
export const firebaseConfig = {
    apiKey: "AIzaSyA3IttEIo6xfRsCGDiMsEpOnAJs94alo00",
    authDomain: "drumre-15d77.firebaseapp.com",
    projectId: "drumre-15d77",
    storageBucket: "drumre-15d77.appspot.com",
    messagingSenderId: "91050764028",
    appId: "1:91050764028:web:d86960424bb76444b09979",
    databaseURL: "https://drumre-15d77-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
