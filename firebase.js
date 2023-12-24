import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { firebaseConfig} from "./importDB.js";


const app = initializeApp(firebaseConfig);
export const auth = getAuth();
