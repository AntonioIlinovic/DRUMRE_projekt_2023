import React, {useState, useEffect, useContext} from 'react';
import { getFirestore, collection, query, orderBy, startAfter, limit, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import InfiniteScroll from 'react-infinite-scroll-component';
import Kartica from '../components/Kartica'; // Make sure the path to Kartica is correct
import { firebaseConfig } from '../../importDB.js';
import Contextpage from "../Contextpage.jsx";
import Naslov from "../components/Naslov.jsx"; // Your Firebase configuration file
import { motion } from 'framer-motion';

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

const MoviesList = () => {
    const { user } = useContext(Contextpage);

    // Check if user is logged in
    const isLoggedIn = !!user; // Converts user to a boolean value


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
                ? query(collection(db, 'movies'), orderBy('popularity', 'desc'), startAfter(lastDoc), limit(30))
                : query(collection(db, 'movies'), orderBy('popularity', 'desc'), limit(30));
            const documentSnapshots = await getDocs(moviesQuery);
            const newMovies = documentSnapshots.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setMovies((prevMovies) => [...prevMovies, ...newMovies]);
            setLastDoc(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
            setHasMore(documentSnapshots.docs.length >= 10);
        } catch (error) {
            console.error("Error fetching movies:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        isLoggedIn ? (
            <div>
                <>
                    <h2>Movies List From the Firestore DataBase -> NOSQL DB</h2>
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
            ) : (
            <>
                <div className='w-full bg-[#10141e] md:p-10 mb-20 md:mb-0'>
                    <Naslov />
                    <motion.div
                        layout
                        className="w-full md:p-2 flex flex-wrap relative justify-evenly md:justify-around">
                        <div className="text-white text-center">
                            <p className="text-lg">You are not logged in.</p>
                        </div>
                    </motion.div>
                </div>
            </>

        )
    );
};

export default MoviesList;
