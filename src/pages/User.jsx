import React, { useContext, useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../importDB.js';
import Naslov from '../components/Naslov';
import Contextpage from '../Contextpage';
import { motion } from 'framer-motion';
import { GENRE_MAP } from "./Recommended.jsx";

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

function User() {
    const { user } = useContext(Contextpage);
    const isLoggedIn = !!user;

    const [bookmarkedMoviesCount, setBookmarkedMoviesCount] = useState(0);
    const [favoriteGenres, setFavoriteGenres] = useState([]);

    useEffect(() => {
        if (user) {
            const fetchBookmarkedMovies = async () => {
                const bookmarksRef = collection(db, "Users", user.email, "BookmarkedMovies");
                const querySnapshot = await getDocs(bookmarksRef);
                setBookmarkedMoviesCount(querySnapshot.docs.length);

                const genreCounts = {};
                querySnapshot.forEach((doc) => {
                    doc.data().genre_ids.forEach((genreId) => {
                        genreCounts[genreId] = (genreCounts[genreId] || 0) + 1;
                    });
                });

                const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
                setFavoriteGenres(sortedGenres.map(([genreId, _]) => genreId).slice(0, 3)); // Top 3 genres
            };

            fetchBookmarkedMovies();
        }
    }, [user]);

    return (
        <>
            <div className='w-full bg-[#10141e] md:p-10 mb-20 md:mb-0'>
                <header className="flex items-center justify-center text-3xl md:text-4xl font-bold text-red-500 py-3 px-5 md:px-10">
                    User Details
                </header>
                <motion.div layout className="w-full md:p-2 flex flex-wrap relative justify-evenly md:justify-around">
                    <div className="text-white text-center">
                        {isLoggedIn ? (
                            <div className="user-info">
                                <p className="text-lg">Email: {user.email}</p>
                                <p className="text-lg">Name: {user.displayName || 'N/A'}</p>
                                <p className="text-lg">Favorite Movies: {bookmarkedMoviesCount}</p>
                                <p className="text-lg">Favorite Genres: {favoriteGenres.map((genreId) => GENRE_MAP[genreId]).join(', ')}</p>
                                {user.photoURL && (
                                    <img src={user.photoURL} alt="user" className="w-40 h-40 rounded-full mx-auto my-4" />
                                )}
                            </div>
                        ) : (
                            <p className="text-lg">You are not logged in.</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default User;
