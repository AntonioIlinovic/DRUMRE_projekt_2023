import React, { useState, useEffect, useContext } from 'react';
import { getFirestore, collection, query, orderBy, startAfter, limit, getDocs, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import InfiniteScroll from 'react-infinite-scroll-component';
import Kartica from '../components/Kartica'; // Adjust the path if necessary
import { firebaseConfig } from '../../importDB.js';
import Contextpage from "../Contextpage.jsx";
import Zanrovi from "../components/Zanrovi.jsx";

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

const MoviesList = () => {
    const { activegenre } = useContext(Contextpage);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        // Reset states and fetch movies when activegenre changes
        setMovies([]);
        setLastDoc(null);
        setHasMore(true);
        fetchMovies(true); // Fetch the initial set of movies
    }, [activegenre]); // Dependency on activegenre

    const fetchMovies = async (initialFetch = false) => {
        if (!hasMore || loading) return;

        setLoading(true);

        try {
            let moviesQuery;
            if (activegenre && activegenre > 0) {
                moviesQuery = initialFetch
                    ? query(collection(db, 'Movies'), where('genre_ids', 'array-contains', activegenre), orderBy('vote_average', 'desc'), limit(100))
                    : query(collection(db, 'Movies'), where('genre_ids', 'array-contains', activegenre), orderBy('vote_average', 'desc'), startAfter(lastDoc), limit(100));
            } else {
                moviesQuery = initialFetch
                    ? query(collection(db, 'Movies'), orderBy('vote_average', 'desc'), limit(100))
                    : query(collection(db, 'Movies'), orderBy('vote_average', 'desc'), startAfter(lastDoc), limit(100));
            }

            const documentSnapshots = await getDocs(moviesQuery);

            if (!documentSnapshots.empty) {
                const newMovies = documentSnapshots.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setMovies(prevMovies => initialFetch ? [...newMovies] : [...prevMovies, ...newMovies]);
                setLastDoc(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
                setHasMore(documentSnapshots.docs.length >= 100);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <header className="flex items-center justify-center text-3xl md:text-4xl font-bold text-red-500 py-3 px-5 md:px-10">
                Popular Movies
            </header>

            <Zanrovi />

            <InfiniteScroll
                dataLength={movies.length}
                next={() => fetchMovies()}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p style={{ textAlign: 'center' }}><b>Yay! You have seen it all</b></p>}
            >
                <div className="grid grid-cols-5 gap-4" style={{ padding: '0 50px' }}>
                    {movies.map((movie) => (
                        <Kartica key={movie.id} movie={movie} />
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default MoviesList;
