import React, {useState, useEffect, useContext} from 'react';
import {getFirestore, collection, query, orderBy, startAfter, limit, getDocs} from 'firebase/firestore';
import {initializeApp} from 'firebase/app';
import InfiniteScroll from 'react-infinite-scroll-component';
import Kartica from '../components/Kartica'; // Make sure the path to Kartica is correct
import {firebaseConfig} from '../../importDB.js';
import Contextpage from "../Contextpage.jsx";
import Naslov from "../components/Naslov.jsx";
import {AnimatePresence, motion} from 'framer-motion';

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

const MoviesList = () => {
    const {user, loader} = useContext(Contextpage);
    const isLoggedIn = !!user;

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchMovies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchMovies = async () => {
        setLoading(true);
        try {
            const moviesQuery = lastDoc
                ? query(collection(db, 'movies'), orderBy('vote_average', 'desc'), startAfter(lastDoc), limit(100))
                : query(collection(db, 'movies'), orderBy('vote_average', 'desc'), limit(100));
            const documentSnapshots = await getDocs(moviesQuery);
            const newMovies = documentSnapshots.docs.map((doc) => ({id: doc.id, ...doc.data()}));
            setMovies((prevMovies) => [...prevMovies, ...newMovies]);
            setLastDoc(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
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
