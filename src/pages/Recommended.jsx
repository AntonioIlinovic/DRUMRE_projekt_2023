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

// Hardcoded genre map
const GENRE_MAP = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
};

const MoviesList = () => {
    const {user, loader} = useContext(Contextpage);
    const isLoggedIn = !!user;

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const [topGenres, setTopGenres] = useState([]);
    const [favoriteMoviesIds, setFavoriteMoviesIds] = useState([]);

    // Fetch the favorite genres and set the top 2
    const fetchAndCountGenres = async () => {
        if (!user) return;

        setLoading(true);
        const genreCounts = {};
        const bookmarksRef = collection(db, "Users", user.email, "BookmarkedMovies");
        const querySnapshot = await getDocs(bookmarksRef);

        // Count the genres
        querySnapshot.forEach((doc) => {
            const movie = doc.data();
            movie.genre_ids.forEach((genreId) => {
                genreCounts[genreId] = (genreCounts[genreId] || 0) + 1;
            });

            // Add the movie id to the favorite movies ids
            setFavoriteMoviesIds(prevFavoriteMoviesIds => [...prevFavoriteMoviesIds, movie.id])
        });

        // Get the top 2 genres
        const topGenresIds = Object.entries(genreCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 1)
            .map(([genreId, _]) => parseInt(genreId));

        setTopGenres(topGenresIds);
    };

    // Fetch movies that belong to the top 2 genres
    const fetchTopGenreMovies = async () => {
        if (!topGenres.length) return;

        try {
            // Fetch movies from top genres
            let moviesQuery = query(
                collection(db, 'movies'),
                where('genre_ids', 'array-contains-any', topGenres),
                orderBy('vote_average', 'desc'),
                limit(100)
            );

            if (lastDoc) {
                moviesQuery = query(moviesQuery, startAfter(lastDoc));
            }

            const documentSnapshots = await getDocs(moviesQuery);
            const fetchedMovies = documentSnapshots.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Now filter out movies that are already in the user's favorites
            const filteredMovies = fetchedMovies.filter(movie => !favoriteMoviesIds.includes(movie.id));

            setMovies(filteredMovies);
            setLastDoc(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
            setHasMore(documentSnapshots.docs.length >= 100);

        } catch (error) {
            console.error("Error fetching top genre movies:", error);
        } finally {
            setLoading(false);
            console.log("Top genres id and name:", topGenres.map((genreId) => `${genreId} - ${GENRE_MAP[genreId]}`));
        }
    };



    // useEffect to fetch and count genres when the component mounts or the user changes
    useEffect(() => {
        fetchAndCountGenres();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // useEffect to fetch movies after the top genres are identified
    useEffect(() => {
        fetchTopGenreMovies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topGenres]);


    const fetchMovies = async () => {
        // from what genres are most present in logged in user's bookmarks
        console.log(favoriteMoviesIds)
    };



    return (
        isLoggedIn ? (
            <div>
                <>
                    <header
                        className={"flex  items-center justify-center text-3xl md:text-4xl font-bold text-red-500 py-3 px-5 md:px-10"}>
                        Recommended Movies
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
        ) : (
            <>
                <div className='w-full bg-[#10141e] md:p-10 mb-20 md:mb-0'>

                    <header
                        className={"flex  items-center justify-center text-3xl md:text-4xl font-bold text-red-500 py-3 px-5 md:px-10"}>
                        Recommended Movies
                    </header>

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
