import React, {useState, useEffect, useContext} from 'react';
import {getFirestore, collection, query, orderBy, startAfter, limit, getDocs, where} from 'firebase/firestore';
import {initializeApp} from 'firebase/app';
import InfiniteScroll from 'react-infinite-scroll-component';
import Kartica from '../components/Kartica'; // Make sure the path to Kartica is correct
import {firebaseConfig} from '../../importDB.js';
import Contextpage from "../Contextpage.jsx";
import Naslov from "../components/Naslov.jsx";
import {AnimatePresence, motion} from 'framer-motion';
import Zanrovi from "../components/Zanrovi.jsx";

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

const MoviesList = () => {
    const {user, loader, activegenre, activegenreName} = useContext(Contextpage);
    const isLoggedIn = !!user;

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        // This effect should run only once when the component mounts,
        // hence the empty dependency array.
        fetchMovies();
    }, []);

    useEffect(() => {
        // This effect should run every time `activegenre` changes.
        // Reset the state to initial values and then fetch movies for the new genre.
        setMovies([]);
        setLastDoc(null);
        setHasMore(true);
        fetchMovies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activegenre]);


    const fetchMovies = async () => {
        // Exit early if there are no more movies to fetch.
        if (!hasMore) return;

        setLoading(true);
        setMovies([]); // Reset movies list whenever we fetch a new genre
        setLastDoc(null); // Reset the last document reference

        try {
            let moviesQuery;
            if (activegenre && activegenre > 0) {
                moviesQuery = query(
                    collection(db, 'movies'),
                    where('genre_ids', 'array-contains', activegenre),
                    orderBy('vote_average', 'desc'),
                    limit(100)
                );
            } else {
                // If activegenre is not set or is 0, fetch movies without genre filter
                moviesQuery = query(
                    collection(db, 'movies'),
                    orderBy('vote_average', 'desc'),
                    limit(100)
                );
            }

            const documentSnapshots = await getDocs(moviesQuery);
            // Check if we have received any documents.
            if (documentSnapshots.empty) {
                setHasMore(false);
                return;
            }

            const newMovies = documentSnapshots.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setMovies(newMovies); // Set new movies
            // Set the last document from the results as the starting point for the next query.
            setLastDoc(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
            // Determine if there are more movies to fetch based on the number of documents retrieved.
            setHasMore(documentSnapshots.docs.length >= 100);
        } catch (error) {
            console.error("Error fetching movies:", error);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div>
            <>
                <header
                    className={"flex  items-center justify-center text-3xl md:text-4xl font-bold text-red-500 py-3 px-5 md:px-10"}>
                    Popular Movies
                </header>

                <Zanrovi />

                <InfiniteScroll
                    dataLength={movies.length}
                    next={fetchMovies}
                    hasMore={hasMore}
                    endMessage={
                        <p style={{textAlign: 'center'}}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                >
                    <div className="grid grid-cols-5 gap-4" style={{padding: '0 50px'}}>
                        {movies.map((movie, index) => (
                            <Kartica key={index} movie={movie}/>
                        ))}
                    </div>
                </InfiniteScroll>
            </>
        </div>
    );
};

export default MoviesList;
