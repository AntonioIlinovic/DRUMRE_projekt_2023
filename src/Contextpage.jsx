import {createContext, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import {auth} from '../firebase';
import {useAuthState} from "react-firebase-hooks/auth"
import {APIKEY, firebaseConfig} from "../importDB.js";
import {collection, doc, getDocs, getFirestore, query, setDoc, where} from "firebase/firestore";
import {initializeApp} from "firebase/app";


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const Contextpage = createContext();

export function MovieProvider({children}) {

    const [header, setHeader] = useState("Recommended");
    const [totalPage, setTotalPage] = useState(null)
    const [movies, setMovies] = useState([]);
    const [searchedMovies, setSearchedMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [activegenre, setActiveGenre] = useState(28);
    const [genres, setGenres] = useState([])
    const [loader, setLoader] = useState(true);
    const [backgenre, setBackGenre] = useState(false);
    const [user, setUser] = useAuthState(auth)
    const navigate = useNavigate();


    useEffect(() => {
        if (page < 1) {
            setPage(1)
        }
    }, [page]);


    // Function to check and add if user's email doesn't exist in 'favorites' collection
    const checkUserFavoriteExists = async (email) => {
        const favoritesCollection = collection(db, 'favorites');
        const favoritesSnapshot = await getDocs(favoritesCollection);

        let userExists = false;

        // Loop through the documents in the collection
        favoritesSnapshot.forEach((doc) => {
            if (doc.data().email === email) {
                userExists = true;
            }
        });

        if (!userExists) {
            await setDoc(doc(db, "favorites", email), {
                email: email,
                movies: []
            });
        }
    };


    const filteredGenre = async () => {
        const data = await fetch(
            `https://api.themoviedb.org/3/discover/movie?with_genres=${activegenre}&api_key=${APIKEY}&with_origin_country=US&page=${page}`
        );
        const filteredGenre = await data.json();
        setMovies(movies.concat(filteredGenre.results));
        setTotalPage(filteredGenre.total_pages);
        setLoader(false);
        setHeader("Recommended");

    };

    const fetchSearch = async (query) => {
        const data = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&with_origin_country=IN&language=en-US&query=${query}&page=1&include_adult=false`
        );
        const searchmovies = await data.json();
        setSearchedMovies(searchmovies.results);
        setLoader(false);
        setHeader(`Results for "${query}"`);
    }

    const fetchGenre = async () => {
        const data = await fetch(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=${APIKEY}&with_origin_country=IN&language=en-US`
        );
        const gen = await data.json();
        setGenres(gen.genres);
    }

    // create local storage
    const GetFavorite = () => {
        setLoader(false);
        setHeader("Favorite Movies");
    }


    //<========= firebase Google Authentication ========>
    const googleProvider = new GoogleAuthProvider();// =====> google auth provider

    const GoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);

            // add user email to favorite collection
            await checkUserFavoriteExists(result.user.email);

            // TODO odkomentiaj
            //navigate("/")
        } catch (err) {
            console.log(err)
            navigate("/")
        }
    }

    return (
        <Contextpage.Provider
            value={{
                fetchGenre,
                genres,
                setGenres,
                filteredGenre,
                header,
                setHeader,
                movies,
                setMovies,
                page,
                setPage,
                activegenre,
                setActiveGenre,
                fetchSearch,
                loader,
                setBackGenre,
                backgenre,
                setLoader,
                GetFavorite,
                totalPage,
                searchedMovies,
                GoogleLogin,
                user
            }}
        >
            {children}
        </Contextpage.Provider>
    );

}

export default Contextpage
